const fs = require('fs');
const path = require('path');

// === Paths ===
const indexPath = path.join(__dirname, '..', 'data', 'youtube_index.json');
const contentDir = path.join(__dirname, '..', 'content', 'videos');

// === Read youtube_index.json ===
if (!fs.existsSync(indexPath)) {
  console.error('❌ data/youtube_index.json not found.');
  process.exit(1);
}

const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
const totalPages = indexData.totalPages;

if (!totalPages || totalPages < 1) {
  console.error('❌ Invalid or missing "totalPages" in youtube_index.json.');
  process.exit(1);
}

// === Ensure content/videos directory exists ===
if (!fs.existsSync(contentDir)) {
  console.error('❌ content/videos folder does not exist. Check Path.');
  process.exit(1);
}

// === Generate one .md file per page ===
for (let i = 1; i <= totalPages; i++) {
  const filePath = path.join(contentDir, `${i}.md`);
  const frontMatter = `---
headTitle: "Watch Training Videos from India's #1 Basketball Academy - Page ${i} | IB Sports Academy"
title: "Watch Training Videos from India's #1 Basketball Academy - Page ${i} | IB Sports Academy"
description: "Watch elite basketball training videos from IB Sports Academy. Learn NBA-level drills, youth coaching tips, and real game action from India's top basketball academy | Delhi's top basketball academy."
layout: "videos/page"
page_number: ${i}
draft: false
---
`;

  fs.writeFileSync(filePath, frontMatter);
  console.log(`✅ Generated: content/videos/${i}.md`);
}

console.log(`🎉 All ${totalPages} video pages generated successfully.`);
