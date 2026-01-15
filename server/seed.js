import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const ExerciseSchema = new mongoose.Schema({
  id: Number,
  name: String,
  category: String,
  equipment: String,
  difficulty: String,
  description: String,
  video_url: String,
  image_url: String,
  tips: String
});

const BlogSchema = new mongoose.Schema({
  id: Number,
  title: String,
  author: String,
  date: String,
  content: String,
  image_url: String,
  url: String
});

const Exercise = mongoose.model('Exercise', ExerciseSchema);
const Blog = mongoose.model('Blog', BlogSchema);

const exercises = [
  {
    id: 1,
    name: 'Barbell Bench Press',
    category: 'Chest',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    description: 'A compound exercise for building upper body strength.',
    video_url: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
    image_url: 'https://images.unsplash.com/photo-1690731033723-ad718c6e585a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tips: 'Keep your back flat and control the descent.'
  },
  {
    id: 2,
    name: 'Squat',
    category: 'Legs',
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    description: 'A foundational leg exercise that builds overall lower body strength.',
    video_url: 'https://www.youtube.com/watch?v=Dy28eq2PjcM',
    image_url: 'https://images.unsplash.com/photo-1624513764370-f29d72dc4e19?q=80&w=742&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tips: 'Drive through your heels and maintain an upright chest.'
  },
  {
    id: 3,
    name: 'Deadlift',
    category: 'Back',
    equipment: 'Barbell',
    difficulty: 'Advanced',
    description: 'Builds strength in the posterior chain, including hamstrings and back.',
    video_url: 'https://www.youtube.com/watch?v=op9kVnSso6Q',
    image_url: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tips: 'Keep the bar close and engage your lats.'
  },
  {
    id: 4,
    name: 'Pull-Up',
    category: 'Back',
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    description: 'Develops upper body pulling strength.',
    video_url: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
    image_url: 'https://images.unsplash.com/photo-1575898311530-2af21854a893?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tips: 'Pull with your elbows and avoid swinging.'
  },
  {
    id: 5,
    name: 'Push-Up',
    category: 'Chest',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    description: 'Classic upper body exercise engaging chest, triceps, and shoulders.',
    video_url: 'https://www.youtube.com/watch?v=_l3ySVKYVJ8',
    image_url: 'https://images.unsplash.com/photo-1682048682610-20a91f10b29c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tips: 'Keep your core tight and avoid sagging hips.'
  },
  {
    id: 6,
    name: 'Dumbbell Shoulder Press',
    category: 'Shoulders',
    equipment: 'Dumbbell',
    difficulty: 'Intermediate',
    description: 'Targets deltoids for shoulder strength.',
    video_url: 'https://www.youtube.com/watch?v=qEwKCR5JCog',
    image_url: 'https://images.unsplash.com/photo-1618169480981-ddb08182cfa8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tips: 'Do not arch your back; keep core tight.'
  },
  {
    id: 7,
    name: 'Bicep Curl',
    category: 'Arms',
    equipment: 'Dumbbell',
    difficulty: 'Beginner',
    description: 'Isolates the biceps for arm strength and tone.',
    video_url: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    image_url: 'https://images.unsplash.com/photo-1598268030450-7a476f602bf6?q=80&w=1115&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tips: 'Avoid swinging and control each rep.'
  },
  {
    id: 8,
    name: 'Plank',
    category: 'Core',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    description: 'Improves core stability and endurance.',
    video_url: 'https://www.youtube.com/watch?v=pSHjTRCQxIw',
    image_url: 'https://images.unsplash.com/photo-1727712763476-f4e4e183ca4e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tips: 'Maintain a straight line from head to heels.'
  },
  {
    id: 9,
    name: 'Lunges',
    category: 'Legs',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    description: 'Improves balance and leg strength.',
    video_url: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
    image_url: 'https://images.unsplash.com/photo-1650116385006-2a82a7b9941b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tips: 'Keep your knee aligned with your toes.'
  },
  {
    id: 10,
    name: 'Crunches',
    category: 'Core',
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    description: 'Targets abdominal muscles for core strength.',
    video_url: 'https://www.youtube.com/watch?v=Xyd_fa5zoEU',
    image_url: 'https://images.unsplash.com/photo-1616803824305-a07cfbc8ea60?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tips: 'Do not pull on your neck.'
  },
  {
    id: 11,
    name: 'Lat Pulldown',
    category: 'Back',
    equipment: 'Machine',
    difficulty: 'Intermediate',
    description: 'Focuses on the lats for a wider back.',
    video_url: 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
    image_url: 'https://images.unsplash.com/photo-1737608746338-94a6cd57d841?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tips: 'Pull the bar to your upper chest.'
  },
  {
    id: 12,
    name: 'Tricep Dips',
    category: 'Arms',
    equipment: 'Parallel Bars',
    difficulty: 'Intermediate',
    description: 'Targets triceps using bodyweight.',
    video_url: 'https://www.youtube.com/watch?v=0326dy_-CzM',
    image_url: 'https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tips: 'Keep elbows tucked and avoid shoulder shrug.'
  },
  {
    id: 13,
    name: 'Leg Press',
    category: 'Legs',
    equipment: 'Machine',
    difficulty: 'Intermediate',
    description: 'Builds quadriceps and hamstring strength.',
    video_url: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
    image_url: 'https://images.unsplash.com/photo-1744551612249-655d096b9f95?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tips: 'Do not lock your knees.'
  },
  {
    id: 14,
    name: 'Mountain Climbers',
    category: 'Cardio',
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    description: 'Full-body cardio exercise that builds endurance.',
    video_url: 'https://www.youtube.com/watch?v=nmwgirgXLYM',
    image_url: 'https://images.unsplash.com/photo-1608138278545-366680accc66?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tips: 'Keep your hips low and move quickly.'
  },
  {
    id: 15,
    name: 'Burpees',
    category: 'Cardio',
    equipment: 'Bodyweight',
    difficulty: 'Advanced',
    description: 'A high-intensity full-body movement for strength and conditioning.',
    video_url: 'https://www.youtube.com/watch?v=TU8QYVW0gDU',
    image_url: 'https://images.unsplash.com/photo-1600677396341-16965cbe9224?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    tips: 'Land softly and keep your core engaged.'
  }
];

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

    await Exercise.deleteMany();
    await Blog.deleteMany();

    await Exercise.insertMany(exercises);
    await Blog.insertMany(blogs);

    console.log('✅ Seed data inserted successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding data:', err);
    process.exit(1);
  }
})();


