import os
import django
import subprocess
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def run_command(command):
    """Run a command and return its output"""
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True, encoding='utf-8')
        if result.returncode == 0:
            print(f"SUCCESS: {command}")
            if result.stdout:
                print(result.stdout)
        else:
            print(f"ERROR: {command}")
            if result.stderr:
                print(result.stderr)
        return result.returncode == 0
    except Exception as e:
        print(f"Error running command '{command}': {e}")
        return False

def setup_quizzes():
    print("Setting up Quiz functionality...")
    
    # Create migrations
    print("\n1. Creating migrations...")
    if not run_command("python manage.py makemigrations quizzes"):
        print("Failed to create migrations")
        return False
    
    # Run migrations
    print("\n2. Running migrations...")
    if not run_command("python manage.py migrate"):
        print("Failed to run migrations")
        return False
    
    # Create sample quizzes
    print("\n3. Creating sample quizzes...")
    try:
        from create_sample_quizzes import create_sample_quizzes
        create_sample_quizzes()
        print("SUCCESS: Sample quizzes created successfully!")
    except Exception as e:
        print(f"ERROR: Error creating sample quizzes: {e}")
        return False
    
    print("\nSUCCESS: Quiz setup completed successfully!")
    print("\nNext steps:")
    print("1. Start the Django server: python manage.py runserver")
    print("2. Start the React frontend: npm start")
    print("3. Navigate to the Explore > Quizzes section to test the functionality")
    
    return True

if __name__ == "__main__":
    setup_quizzes()