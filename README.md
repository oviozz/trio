🧠 Inspiration
Shopping online is convenient—but how many times have you ordered something that looked great in the photo, only to try it on and… meh 😬? Our team wanted to solve that. We wanted to create a way for people to see how a product would look before they buy, without leaving their home. That’s how Trio was born—a virtual try-on experience that helps you shop smarter and more confidently.

🔧 How We Built It
We combined some of the coolest tools and frameworks to bring Trio to life:

🧪 Next.js – used for building our fast and interactive frontend experience.
🔥 Supabase – handled file storage and image upload, especially for user-submitted try-on images.
🤖 Gemini API – fine-tuned for image generation. We trained it on product images to understand and simulate real-life try-on results.
🐍 Next Server Routes – used for our backend server. It handles image processing, user requests, and interacts with the Gemini model.
🧠 Custom Gemini Model – we fed it hundreds of product try-on images to fine-tune it to our use case. Before making a final try-on prediction, we preprocess and enhance images to match lighting, angles, and context.
The user takes or uploads a photo, selects a product they want to try, and gets an AI-generated try-on image using our custom-tuned Gemini model. Fast, fun, and frustration-free. 😎

💡 What We Learned
We dove deep into:

Image preprocessing and AI-based try-on generation
How to work with fine-tuned AI models
Connecting a Python Flask backend to a Next.js frontend smoothly
Using Supabase to manage file uploads and storage with ease
Managing fast feedback loops for real-time visual updates
🚧 Challenges We Faced
Image alignment: Matching the product image to the user’s body/photo took a lot of experimentation with image augmentation and pose detection.
Model tuning: Getting our Gemini model to generate clean and realistic outputs wasn’t easy—we needed tons of sample images and careful parameter tweaking.
Storage speed: Optimizing file upload and access time with Supabase to keep the UX smooth and snappy.
Frontend to backend flow: Ensuring the user experience felt seamless while coordinating multiple moving parts across different tech stacks.
🚀 What's Next?
We plan to:

Add support for more product types (shoes, accessories, hats 🎩)
Trio is all about making online shopping fun, accurate, and personalized. No more returns, no more guesswork—just try it on. ✨
