#!/bin/bash

# Email Domain Verification Fix - Migration Application Script
# This script helps apply the database migration to fix email domain verification

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║   Email Domain Verification Fix - Migration Application      ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Check if running in project directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "This script will help you apply the email domain verification fix."
echo ""
echo "⚠️  IMPORTANT NOTES:"
echo "   - This fix will prevent signups from unauthorized email domains"
echo "   - After applying, only emails from domains in 'email_domains' table can sign up"
echo "   - Existing users with unauthorized domains will remain (but no new ones can sign up)"
echo ""
echo "Choose your deployment method:"
echo ""
echo "1) Local Supabase (using Supabase CLI)"
echo "2) Remote Supabase (I'll provide SQL to run manually)"
echo "3) Exit"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "Checking for Supabase CLI..."
        
        if ! command -v supabase &> /dev/null; then
            echo "❌ Supabase CLI not found!"
            echo ""
            echo "To install Supabase CLI:"
            echo "  macOS: brew install supabase/tap/supabase"
            echo "  npm:   npm install -g supabase"
            echo ""
            echo "Visit: https://supabase.com/docs/guides/cli"
            exit 1
        fi
        
        echo "✅ Supabase CLI found"
        echo ""
        echo "Applying migration to local Supabase..."
        
        # Check if local Supabase is running
        if supabase status &> /dev/null; then
            echo "✅ Local Supabase is running"
            echo ""
            
            # Apply the migration
            supabase migration up
            
            if [ $? -eq 0 ]; then
                echo ""
                echo "✅ Migration applied successfully!"
                echo ""
                echo "Next steps:"
                echo "1. Test signup with unauthorized email - should fail"
                echo "2. Test signup with authorized email - should succeed"
                echo "3. Check the EMAIL_DOMAIN_VERIFICATION_FIX.md for details"
            else
                echo ""
                echo "❌ Migration failed. Check the error above."
            fi
        else
            echo "⚠️  Local Supabase is not running"
            echo ""
            read -p "Would you like to start it? (y/n): " start_choice
            
            if [ "$start_choice" = "y" ] || [ "$start_choice" = "Y" ]; then
                supabase start
                
                if [ $? -eq 0 ]; then
                    echo ""
                    echo "Applying migration..."
                    supabase migration up
                    
                    if [ $? -eq 0 ]; then
                        echo ""
                        echo "✅ Migration applied successfully!"
                    fi
                fi
            fi
        fi
        ;;
        
    2)
        echo ""
        echo "═══════════════════════════════════════════════════════════════"
        echo "Manual Migration Steps for Remote Supabase"
        echo "═══════════════════════════════════════════════════════════════"
        echo ""
        echo "1. Go to your Supabase project dashboard"
        echo "   URL: https://app.supabase.com/project/YOUR_PROJECT_ID"
        echo ""
        echo "2. Navigate to: SQL Editor (left sidebar)"
        echo ""
        echo "3. Click 'New Query'"
        echo ""
        echo "4. Copy the ENTIRE contents of this file:"
        echo "   supabase/migrations/20251118000000_fix_email_domain_verification.sql"
        echo ""
        echo "5. Paste it into the SQL Editor"
        echo ""
        echo "6. Click 'Run' (or press Cmd/Ctrl + Enter)"
        echo ""
        echo "7. Verify all functions were created:"
        echo "   - validate_email_domain"
        echo "   - check_email_domain"
        echo "   - create_profile_for_user (updated)"
        echo ""
        echo "8. Test the fix by attempting signup with unauthorized email"
        echo ""
        echo "═══════════════════════════════════════════════════════════════"
        echo ""
        read -p "Press Enter to open the migration file location..."
        
        if command -v open &> /dev/null; then
            open supabase/migrations/
        elif command -v xdg-open &> /dev/null; then
            xdg-open supabase/migrations/
        else
            echo "Migration file location: $(pwd)/supabase/migrations/"
        fi
        ;;
        
    3)
        echo "Exiting..."
        exit 0
        ;;
        
    *)
        echo "❌ Invalid choice. Exiting..."
        exit 1
        ;;
esac

echo ""
echo "For more information, see: EMAIL_DOMAIN_VERIFICATION_FIX.md"
echo ""
