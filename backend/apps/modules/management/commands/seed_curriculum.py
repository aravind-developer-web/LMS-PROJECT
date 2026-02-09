from django.core.management.base import BaseCommand
from apps.modules.models import Module, Resource
from apps.quiz.models import Quiz, Question, Answer
from apps.authapp.models import User
from apps.assignments.models import Assignment
from django.utils import timezone

class Command(BaseCommand):
    help = 'Seeds the GenAI Fundamentals curriculum with FAANG-grade content'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding Neural Curriculum...')

        # --- Module 1: GenAI Fundamentals ---
        module1, created = Module.objects.update_or_create(
            title="GenAI Fundamentals: Week 1",
            defaults={
                "description": "A comprehensive 4-week track designed to upskill your engineering team on the latest in AI, from Prompt Engineering to RAG implementation.",
                "duration": 600,
                "difficulty": "intermediate",
                "priority": 1,
                "assignment_prompt": "Develop a Python script using the OpenAI API (or a mock) to summarize a given text file. The script should handle rate limiting and token counting. Submit your GitHub Gist link below.",
                "has_quiz": True,
                "has_assignment": True
            }
        )

        # Resources for Module 1 (Using reliable, embeddable YouTube links)
        resources_1 = [
            {
                "title": "Generative AI Explained",
                "type": "video",
                "url": "https://www.youtube.com/watch?v=G2fqAlgmoPo", # Google Cloud Tech
                "order": 1,
                "description": "High-level overview of GenAI concepts."
            },
            {
                "title": "Prompt Engineering Basics",
                "type": "video",
                "url": "https://www.youtube.com/watch?v=_ZvnD73m40o", # Andrew Ng
                "order": 2,
                "description": "Best practices for prompting LLMs."
            },
            {
                "title": "Transformers Architecture",
                "type": "video",
                "url": "https://www.youtube.com/watch?v=sznZ78AWZQg", # Google Cloud Tech
                "order": 3,
                "description": "Understanding the attention mechanism."
            },
            {
                "title": "OWASP Top 10 for LLM",
                "type": "url",
                "url": "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
                "order": 4,
                "description": "Security best practices."
            }
        ]

        self.create_resources(module1, resources_1)
        self.create_quiz(module1, "GenAI Structural Validation", [
            {
                "text": "What is a token in the context of LLMs?",
                "answers": [
                    {"text": "A physical coin", "correct": False},
                    {"text": "A fundamental unit of text (word/sub-word)", "correct": True},
                    {"text": "An API key", "correct": False},
                ]
            },
            {
                "text": "Which mechanism allows Transformers to process entire sequences in parallel?",
                "answers": [
                    {"text": "Recurrence", "correct": False},
                    {"text": "Convolution", "correct": False},
                    {"text": "Self-Attention", "correct": True},
                ]
            },
             {
                "text": "In Prompt Engineering, what is 'few-shot' prompting?",
                "answers": [
                    {"text": "Prompting with a few examples", "correct": True},
                    {"text": "Prompting 3 times only", "correct": False},
                    {"text": "A low-resource setting", "correct": False},
                ]
            }
        ])


        # --- Module 2: Engineering Excellence ---
        module2, created = Module.objects.update_or_create(
            title="Engineering Excellence: Enterprise Patterns",
            defaults={
                "description": "Mastering FAANG-grade engineering standards, from system design to production-ready deployments.",
                "duration": 480,
                "difficulty": "advanced",
                "priority": 2,
                "assignment_prompt": "Refactor a legacy function to adhere to SOLID principles. Provide the 'Before' and 'After' code snippets along with a brief explanation of your design choices.",
                "has_quiz": True,
                "has_assignment": True
            }
        )

        resources_2 = [
            {
                "title": "Clean Code Fundamentals",
                "type": "video",
                "url": "https://www.youtube.com/watch?v=7EmboKQGw8M", 
                "order": 1,
                "description": "Writing code that humans can understand."
            },
            {
                "title": "System Design: Scalability",
                "type": "video",
                "url": "https://www.youtube.com/watch?v=xpDnVSmQcFo", # System Design
                "order": 2,
                "description": "Horizontal vs Vertical scaling."
            },
            {
                "title": "Microservices vs Monolith",
                "type": "video",
                "url": "https://www.youtube.com/watch?v=1xo-0gCVhRE",
                "order": 3,
                "description": "Architectural trade-offs."
            }
        ]
        self.create_resources(module2, resources_2)
        self.create_quiz(module2, "Engineering Standards Validation", [
            {
                "text": "What does the 'S' in SOLID stand for?",
                "answers": [
                    {"text": "Simple Responsibility", "correct": False},
                    {"text": "Single Responsibility Principle", "correct": True},
                    {"text": "Static Typing", "correct": False},
                ]
            },
            {
                "text": "Which is a benefit of Horizontal Scaling?",
                "answers": [
                    {"text": "Easier to manage state", "correct": False},
                    {"text": "No network overhead", "correct": False},
                    {"text": "Unlimited theoretical capacity", "correct": True},
                ]
            }
        ])

        # --- Auto-Assign to Learners ---
        self.assign_modules([module1, module2])

        self.stdout.write(self.style.SUCCESS('Successfully seeded Neural Curriculum.'))

    def create_resources(self, module, resources_data):
        for res_data in resources_data:
            Resource.objects.update_or_create(
                module=module,
                title=res_data["title"],
                defaults={
                    "type": res_data["type"],
                    "url": res_data["url"],
                    "order": res_data["order"],
                    "description": res_data["description"]
                }
            )

    def create_quiz(self, module, title, questions_data):
        quiz, _ = Quiz.objects.update_or_create(
            module=module,
            defaults={"title": title, "passing_score": 80}
        )
        # Clear old questions to avoid duplicates/ordering issues
        quiz.questions.all().delete()
        
        for idx, q_data in enumerate(questions_data, 1):
            question = Question.objects.create(
                quiz=quiz,
                text=q_data["text"],
                order=idx
            )
            for ans_data in q_data["answers"]:
                Answer.objects.create(
                    question=question,
                    text=ans_data["text"],
                    is_correct=ans_data["correct"]
                )

    def assign_modules(self, modules):
        learners = User.objects.filter(role='learner')
        for learner in learners:
            for module in modules:
                Assignment.objects.get_or_create(
                    user=learner,
                    module=module,
                    defaults={"status": "pending"}
                )
