from django.core.management.base import BaseCommand
from apps.authapp.models import User

class Command(BaseCommand):
    help = 'Creates test users for development'

    def handle(self, *args, **kwargs):
        # Create admin if doesn't exist
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@example.com',
                password='admin123',
                first_name='Admin',
                last_name='User',
                role='admin'
            )
            self.stdout.write(self.style.SUCCESS('Created admin user'))
        
        # Create learner if doesn't exist
        if not User.objects.filter(username='aravind').exists():
            User.objects.create_user(
                username='aravind',
                email='aravind@example.com',
                password='test123',
                first_name='Aravind',
                last_name='Learner',
                role='learner'
            )
            self.stdout.write(self.style.SUCCESS('Created learner user: aravind'))
        
        # Create manager if doesn't exist
        if not User.objects.filter(username='manager').exists():
            User.objects.create_user(
                username='manager',
                email='manager@example.com',
                password='manager123',
                first_name='Team',
                last_name='Leader',
                role='manager'
            )
            self.stdout.write(self.style.SUCCESS('Created manager user: manager'))
        
        self.stdout.write(self.style.SUCCESS('Test users ready!'))
        self.stdout.write('Login credentials:')
        self.stdout.write('  Admin: admin / admin123')
        self.stdout.write('  Learner: aravind / test123')
        self.stdout.write('  Manager: manager / manager123')
