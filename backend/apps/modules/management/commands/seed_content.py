from django.core.management.base import BaseCommand
from apps.modules.models import Module, Resource
from apps.quiz.models import Quiz, Question, Answer
from apps.authapp.models import User
import random
from datetime import timedelta

class Command(BaseCommand):
    help = 'Seeds the database with GenAI training content'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')

        # Ensure admin user exists
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin')
            self.stdout.write('Created superuser: admin/admin')

        # Curriculum Data from Screenshots
        curriculum = [
            {
                "title": "LLM Fundamentals & Prompting",
                "description": "Core concepts of Large Language Models, Prompt Engineering patterns, and lifecycle.",
                "duration": 600, # Estimated total minutes
                "difficulty": "beginner",
                "resources": [
                    {"title": "Generative AI with Large Language Models", "type": "url", "url": "https://www.coursera.org/learn/generative-ai-with-llms"},
                    {"title": "ChatGPT Prompt Engineering for Developers", "type": "url", "url": "https://learn.deeplearning.ai/courses/chatgpt-prompt-engineering/information"},
                    {"title": "ChatGPT Prompt Engineering (Video)", "type": "video", "url": "https://www.youtube.com/watch?v=H4YK_7MAckk"},
                    {"title": "OWASP Top 10 for LLM Applications", "type": "pdf", "url": "https://owasp.org/www-project-top-10-for-large-language-model-applications/assets/PDF/OWASP-Top-10-for-LLMs-v2025.pdf"},
                ]
            },
            {
                "title": "Transformer Architecture & Mechanics",
                "description": "Deep dive into the architecture behind GPT and how transformers work.",
                "duration": 180,
                "difficulty": "advanced",
                "resources": [
                    {"title": "Attention in transformers, step-by-step", "type": "video", "url": "https://www.youtube.com/watch?v=eMlx5fFNoYc"},
                    {"title": "Let's build GPT: from scratch", "type": "video", "url": "https://www.youtube.com/watch?v=kCc8FmEb1nY"},
                ]
            },
            {
                "title": "OpenAI API & Agents",
                "description": "Mastering the OpenAI API, lifecycle awareness, and building agents.",
                "duration": 120,
                "difficulty": "intermediate",
                "resources": [
                    {"title": "Responses API reference", "type": "url", "url": "https://platform.openai.com/docs/api-reference/responses"},
                    {"title": "API Deprecations & Lifecycle", "type": "url", "url": "https://platform.openai.com/docs/deprecations"},
                    {"title": "Build Hour: Responses API", "type": "video", "url": "https://www.youtube.com/watch?v=hNr5EebepYs"},
                ]
            },
            {
                "title": "RAG Patterns & Implementation",
                "description": "Retrieval Augmented Generation concepts, patterns, and frameworks (LangChain, LlamaIndex).",
                "duration": 300,
                "difficulty": "advanced",
                "resources": [
                    {"title": "LangChain JS Learn", "type": "url", "url": "https://docs.langchain.com/oss/javascript/learn"},
                    {"title": "LlamaIndex.TS framework docs", "type": "url", "url": "https://developers.llamaindex.ai/typescript/framework/"},
                    {"title": "RAG From Scratch: Part 1", "type": "video", "url": "https://www.youtube.com/watch?v=wd7TZ4w1mSw"},
                    {"title": "Build a RAG pipeline in LlamaIndex", "type": "video", "url": "https://www.youtube.com/watch?v=vNpxWaVzky8"},
                ]
            },
             {
                "title": "Web Foundations & React",
                "description": "Modern web development prerequisites: HTML/CSS, React, and Next.js.",
                "duration": 480,
                "difficulty": "beginner",
                "resources": [
                    {"title": "MDN Web Development Curriculum", "type": "url", "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development"},
                    {"title": "React Quick Start", "type": "url", "url": "https://react.dev/learn"},
                    {"title": "Next.js Learn", "type": "url", "url": "https://nextjs.org/learn"},
                    {"title": "Introduction to Node.js", "type": "url", "url": "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs"},
                    {"title": "React Crash Course", "type": "video", "url": "https://www.youtube.com/watch?v=LDB4uaJ87e0"},
                    {"title": "Next.js in 100 Seconds", "type": "video", "url": "https://www.youtube.com/watch?v=Sklc_fQBmcs"},
                ]
            },
            {
                "title": "GitHub & CI/CD Workflows",
                "description": "Version control, collaboration, and automation with GitHub Actions.",
                "duration": 180,
                "difficulty": "intermediate",
                "resources": [
                    {"title": "GitHub Skills", "type": "url", "url": "https://learn.github.com/skills"},
                    {"title": "Training for GitHub", "type": "url", "url": "https://learn.microsoft.com/en-us/training/github/"},
                    {"title": "Workflow syntax for GitHub Actions", "type": "url", "url": "https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions"},
                    {"title": "Git and GitHub for Beginners", "type": "video", "url": "https://www.youtube.com/watch?v=RGOj5yH7evk"},
                    {"title": "GitHub Pull Request in 100 Seconds", "type": "video", "url": "https://www.youtube.com/watch?v=8lGpZkjnkt4"},
                ]
            },
             {
                "title": "Deployment & Capstone",
                "description": "Deploying to Vercel, security best practices, and final capstone project.",
                "duration": 240,
                "difficulty": "intermediate",
                "resources": [
                    {"title": "Deploy to Vercel (Next.js)", "type": "url", "url": "https://nextjs.org/learn/pages-router/deploying-nextjs-app-deploy"},
                    {"title": "Deploying Next.js to Vercel (Video)", "type": "video", "url": "https://www.youtube.com/watch?v=AiiGjB2AxqA"},
                    {"title": "RAG From Scratch Playlist", "type": "video", "url": "https://www.youtube.com/playlist?list=PLfaIDFEXuae2LXbO1_PKyVJiQ23ZztA0x"},
                    {"title": "Build a Real-Time Chatbot", "type": "video", "url": "https://www.youtube.com/watch?v=_tBTfvQr38M"},
                ]
            }
        ]

        for mod_data in curriculum:
            module, created = Module.objects.get_or_create(
                title=mod_data['title'],
                defaults={
                    "description": mod_data['description'],
                    "duration": mod_data['duration'],
                    "difficulty": mod_data['difficulty']
                }
            )
            
            if created:
                self.stdout.write(f'Created Module: {module.title}')
            else:
                self.stdout.write(f'Updated Module: {module.title}')

            # clear existing resources to prevent duplicates on re-run
            module.resources.all().delete()

            for i, res_data in enumerate(mod_data['resources']):
                Resource.objects.create(
                    module=module,
                    title=res_data['title'],
                    type=res_data['type'],
                    url=res_data['url'],
                    order=i
                )

            # Create/Update Quiz
            qs = Quiz.objects.filter(module=module)
            if qs.exists():
                quiz = qs.first()
            else:
                quiz = Quiz.objects.create(module=module, title=f"Quiz: {module.title}", passing_score=70)
            
            # Simple Generic Questions for demo
            if not quiz.questions.exists():
                q1 = Question.objects.create(
                    quiz=quiz,
                    text=f"What is a primary concept of {module.title}?",
                    # type="single" # Removed as it's not in the model
                )
                q1.answers.create(text="The correct answer", is_correct=True)
                q1.answers.create(text="Wrong answer 1", is_correct=False)
                q1.answers.create(text="Wrong answer 2", is_correct=False)
                
                q2 = Question.objects.create(
                    quiz=quiz,
                    text="Which of the following is true?",
                    # type="single"
                )
                q2.answers.create(text="True statement", is_correct=True)
                q2.answers.create(text="False statement", is_correct=False)

        self.stdout.write(self.style.SUCCESS('Successfully seeded training data'))
