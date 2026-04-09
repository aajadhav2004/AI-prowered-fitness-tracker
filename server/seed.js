import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const BlogSchema = new mongoose.Schema({
  id: Number,
  title: String,
  author: String,
  date: String,
  content: String,
  image_url: String,
  url: String
});

const Blog = mongoose.model('Blog', BlogSchema);

export const blogs = [
  {
    id: 1,
    title: "Yoga in India",
    author: "Wikipedia",
    date: new Date().toISOString().split("T")[0],
    image_url: "https://images.unsplash.com/photo-1714892530388-7d0106430647?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content:
      "Yoga, originating in ancient India, is a group of physical, mental, and spiritual practices aimed at inner peace and physical well-being.",
    url: "https://en.wikipedia.org/wiki/Yoga"
  },
  {
    id: 2,
    title: "Ayurveda – India's Traditional Medicine",
    author: "Wikipedia",
    date: new Date().toISOString().split('T')[0],
    image_url: "https://images.unsplash.com/photo-1521146250551-a5578dcc2e64?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content:
      "Ayurveda is India’s ancient medical system emphasising natural treatments, lifestyle balance, and holistic wellness.",
    url: "https://en.wikipedia.org/wiki/Ayurveda"
  },
  {
    id: 3,
    title: "Indian Runners – Rise of a Fitness Culture",
    author: "Wikipedia",
    date: new Date().toISOString().split('T')[0],
    image_url: "https://images.unsplash.com/photo-1596460658047-1826d5921c56?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content:
      "Running culture has rapidly grown across India, with thousands participating in marathons and fitness events every year.",
    url: "https://en.wikipedia.org/wiki/Running"
  },
  {
    id: 4,
    title: "Virat Kohli – Fitness Transformation",
    author: "Wikipedia",
    date: new Date().toISOString().split('T')[0],
    image_url: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content:
      "Virat Kohli is widely admired in India for his disciplined fitness lifestyle, encouraging a strong culture of physical training.",
    url: "https://en.wikipedia.org/wiki/Virat_Kohli"
  },
  {
    id: 5,
    title: "Sadhguru on Yogic Health Philosophy",
    author: "Wikipedia",
    date: new Date().toISOString().split('T')[0],
    image_url: "https://images.unsplash.com/photo-1732107195798-4cb9db201131?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content:
      "Sadhguru popularizes traditional Indian yogic practices promoting mental clarity, breathing techniques, and holistic health.",
    url: "https://en.wikipedia.org/wiki/Sadhguru"
  },
  {
    id: 6,
    title: "Indian Nutrition: A Balanced Diet",
    author: "Wikipedia",
    date: new Date().toISOString().split('T')[0],
    image_url: "https://images.unsplash.com/photo-1659822887922-c1386185cc6b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content:
      "Traditional Indian diets emphasize balanced nutrition with whole grains, lentils, spices, and plant-based foods.",
    url: "https://en.wikipedia.org/wiki/Indian_cuisine"
  },
  {
    id: 7,
    title: "Baba Ramdev and Modern Yoga Popularity",
    author: "Wikipedia",
    date: new Date().toISOString().split('T')[0],
    image_url: "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content:
      "Baba Ramdev is known for reviving mass-scale yoga and wellness movements through public sessions and TV programs.",
    url: "https://en.wikipedia.org/wiki/Baba_Ramdev"
  },
  {
    id: 8,
    title: "Indian Bodybuilding – Rise of Fitness Icons",
    author: "Wikipedia",
    date: new Date().toISOString().split('T')[0],
    image_url: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content:
      "India has produced several well-known bodybuilders, inspiring youth to adopt strength training and healthy routines.",
    url: "https://en.wikipedia.org/wiki/Sangram_Chougule"
  },
  {
    id: 9,
    title: "Milkha Singh – Inspiration for Indian Fitness",
    author: "Wikipedia",
    date: new Date().toISOString().split('T')[0],
    image_url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content:
      "Milkha Singh remains an iconic figure in Indian sports, motivating millions to pursue athletics.",
    url: "https://en.wikipedia.org/wiki/Milkha_Singh"
  },
  {
    id: 10,
    title: "Kalaripayattu – India’s Ancient Martial Art",
    author: "Wikipedia",
    date: new Date().toISOString().split('T')[0],
    image_url: "https://images.unsplash.com/photo-1611077479643-5b3c01381f9e?q=80&w=1056&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content:
      "Kalaripayattu is one of the oldest martial arts, combining strength, flexibility, meditation, and weapon training.",
    url: "https://en.wikipedia.org/wiki/Kalaripayattu"
  },
  {
    id: 11,
    title: "Indian Home Workouts & Calisthenics",
    author: "Wikipedia",
    date: new Date().toISOString().split('T')[0],
    image_url: "https://images.unsplash.com/photo-1599744331048-d58b430fb098?q=80&w=1076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content:
      "Home workouts and calisthenics have grown popular in India due to accessibility and minimal equipment needs.",
    url: "https://en.wikipedia.org/wiki/Calisthenics"
  },
  {
    id: 12,
    title: "Traditional Indian Sports for Fitness",
    author: "Wikipedia",
    date: new Date().toISOString().split('T')[0],
    image_url: "https://images.unsplash.com/photo-1604162198475-2732e1eacd55?q=80&w=1178&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    content:
      "Sports like Kabaddi, Kho-Kho, and Mallakhamba build incredible agility, strength, and cardiovascular fitness.",
    url: "https://en.wikipedia.org/wiki/Kabaddi"
  }
];


(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ MongoDB connected');

    // Only clear and seed blogs
    await Blog.deleteMany();
    await Blog.insertMany(blogs);

    console.log('✅ Blog seed data inserted successfully!');
    console.log('ℹ️  Exercises/Tutorials should be added via Admin Panel');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding data:', err);
    process.exit(1);
  }
})();


