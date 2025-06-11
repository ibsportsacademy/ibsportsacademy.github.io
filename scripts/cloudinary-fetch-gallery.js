// cloudinary-fetch-gallery.js
require('dotenv').config();

const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.IB_CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.IB_CLOUDINARY_API_KEY,
  api_secret: process.env.IB_CLOUDINARY_API_SECRET
});

const folder = 'IB'; // root folder where events/photos are stored
const altTextPath = path.join(__dirname, '..', 'alttext.json');
const outputPath = path.join(__dirname, '..', 'data/gallery.json');

const generateGalleryJSON = async () => {
  let altTextMap = {};
  if (fs.existsSync(altTextPath)) {
    altTextMap = JSON.parse(fs.readFileSync(altTextPath, 'utf8'));
  }

  let nextCursor = undefined;
  const sections = {}; // group by folder

  do {
    const res = await cloudinary.search
      .expression(`folder:${folder}/*`) // all subfolders/images
      .with_field('context')
      .with_field('tags')
      .sort_by('public_id', 'asc')
      .max_results(500)
      .next_cursor(nextCursor)
      .execute();

    res.resources.forEach(img => {
      const publicId = img.public_id;
      const url = img.secure_url;
      const width = img.width;
      const height = img.height;
      const tags = img.tags || [];
      const pathParts = publicId.split('/');
      const section = pathParts.length > 1 ? pathParts.slice(-2, -1)[0] : 'General';
      const filename = path.basename(publicId).replace(/_[a-zA-Z0-9]{6}$/, "");
      const alt = altTextMap[filename] || filename.replace(/[-_]/g, ' ').replace(/\..+$/, '').trim();

      const schema = {
        '@context': 'https://schema.org',
        '@type': 'ImageObject',
        contentUrl: url,
        description: alt,
        name: alt,
        width: width,
        height: height,
        url: url
      };

      if (!sections[section]) sections[section] = [];
      sections[section].push({ url, alt, width, height, schema });
    });

    nextCursor = res.next_cursor;
  } while (nextCursor);

  fs.writeFileSync(outputPath, JSON.stringify(sections, null, 2));
  console.log(`✅ Gallery JSON generated at: ${outputPath}`);
};

generateGalleryJSON().catch(err => {
  console.error('❌ Error generating gallery JSON:', err);
});

