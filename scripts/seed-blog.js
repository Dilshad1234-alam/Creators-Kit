const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8').split('\n');
  envConfig.forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

// We need to define the schema again since we're using raw Node.js script instead of Next.js module
const blogSchema = new mongoose.Schema({
  title: String,
  slug: String,
  content: String,
  excerpt: String,
  author: String,
  image: String,
}, { timestamps: true });

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

async function seedBlog() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    await Blog.create({
      title: "How I Made $10,000 in My First Month as a Creator",
      slug: "how-i-made-10000-first-month",
      excerpt: "The exact strategies and tools I used to monetize my small audience and turn my passion into a profitable business.",
      content: `
        <h2>The Beginning of the Journey</h2>
        <p>When I first started creating content, I had no idea how to monetize. I had a small but engaged audience, but I didn't know what to sell or how to ask for money.</p>
        
        <blockquote>
          "The Creators Kit changed everything for me. It gave me the exact templates and frameworks to launch my first digital product."
        </blockquote>
        
        <h2>The Strategy</h2>
        <p>Here are the three main steps I took:</p>
        <ol>
          <li><strong>Identify the Pain Point:</strong> I asked my audience what they struggled with the most.</li>
          <li><strong>Create a Solution:</strong> I packaged my knowledge into a simple, actionable digital guide.</li>
          <li><strong>Launch with Confidence:</strong> Using the marketing templates from the Creators Kit, I launched to my email list.</li>
        </ol>
        
        <h2>The Results</h2>
        <p>Within 30 days, I had generated over $10,000 in sales. More importantly, I realized that I didn't need millions of followers to make a full-time income. I just needed the right tools.</p>
      `,
      author: "Sarah Jenkins",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop"
    });

    console.log('Successfully seeded dummy blog post!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding blog:', error);
    process.exit(1);
  }
}

seedBlog();
