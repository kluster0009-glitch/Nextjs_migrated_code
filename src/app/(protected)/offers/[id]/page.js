"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ChevronRight,
  Home,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";

/**
 * Software Details Page
 * 
 * Full-page view for detailed information about a student software benefit.
 * Accessed via dynamic route: /offers/[id]
 */
export default function SoftwareDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const softwareId = params.id ? parseInt(params.id) : null;

  // Student Benefits Data - Same as main page
  // TODO: In production, move this to a shared data file or API
  const studentBenefits = [
    {
      id: 1,
      name: "GitHub Student Developer Pack",
      logo: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
      eligibility: "Verified student status",
      benefits: [
        "Free domains from multiple providers",
        "$200+ in cloud credits",
        "Premium developer tools and services",
        "Free private repositories"
      ],
      link: "https://education.github.com/pack",
      category: "Development",
      details: "The GitHub Student Developer Pack provides students with free access to the best developer tools in one place. It helps students build real-world projects, collaborate with peers, deploy applications, and learn industry-standard development practices. With over 100+ partner offers including domains, cloud hosting, CI/CD tools, and learning resources, students can experiment and learn without financial barriers. This pack is essential for computer science students, web developers, and anyone learning to code, as it provides the same tools used by professional developers worldwide.",
      howToApplySteps: [
        "Visit the GitHub Student Developer Pack website",
        "Sign in with your GitHub account or create a new one",
        "Verify your student status using your school-issued email address (.edu or institutional domain)",
        "Upload proof of enrollment (student ID, transcript, or enrollment letter) if email verification is not available",
        "Wait for verification (usually takes 1-3 business days)",
        "Once approved, access all partner benefits from your GitHub Education dashboard"
      ],
      applyLink: "https://education.github.com/pack"
    },
    {
      id: 2,
      name: "Microsoft Azure for Students",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg",
      eligibility: "College student email",
      benefits: [
        "$100 Azure credits (no credit card required)",
        "Free access to popular Azure services",
        "Free developer tools",
        "Learning resources and tutorials"
      ],
      link: "https://azure.microsoft.com/free/students/",
      category: "Cloud",
      details: "Microsoft Azure for Students empowers students to learn cloud computing and build innovative projects without upfront costs. Students receive $100 in Azure credits to explore cloud services including virtual machines, databases, AI/ML tools, and web hosting. This benefit is crucial for students studying computer science, data science, or any technology field, as cloud computing skills are highly valued in the job market. The no-credit-card-required policy makes it accessible to all students, and the free learning resources help students gain hands-on experience with enterprise-grade cloud infrastructure used by Fortune 500 companies.",
      howToApplySteps: [
        "Go to the Azure for Students website",
        "Click on 'Activate now' or 'Start free'",
        "Sign in with your school email address or Microsoft account",
        "Verify your student status through your educational email",
        "Complete the registration form (no credit card needed)",
        "Start using your $100 Azure credits immediately",
        "Access free learning paths and certifications on Microsoft Learn"
      ],
      applyLink: "https://azure.microsoft.com/free/students/"
    },
    {
      id: 3,
      name: "JetBrains Student License",
      logo: "https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.svg",
      eligibility: "Student email or ISIC card",
      benefits: [
        "All JetBrains IDEs for free",
        "IntelliJ IDEA Ultimate",
        "PyCharm Professional",
        "WebStorm, PhpStorm, and more"
      ],
      link: "https://www.jetbrains.com/community/education/",
      category: "Development",
      details: "JetBrains provides students with free access to all their professional development tools, including IntelliJ IDEA Ultimate for Java development, PyCharm Professional for Python, WebStorm for JavaScript, and many more industry-leading IDEs. These tools help students write better code faster with intelligent code completion, refactoring tools, debugging capabilities, and integrated version control. The professional editions include advanced features like database tools, framework support, and performance profilers that are essential for learning modern software development. Students in computer science, software engineering, and related fields gain access to the same tools used by professional developers at top tech companies.",
      howToApplySteps: [
        "Visit the JetBrains Student License page",
        "Click on 'Apply now' for the free educational license",
        "Create a JetBrains Account or sign in if you already have one",
        "Choose your verification method: Official document (student ID, enrollment certificate) or ISIC/ITIC card",
        "Upload your verification document or enter your ISIC card number",
        "Wait for approval (usually within a few hours to 2 days)",
        "Download and install any JetBrains IDE from your account dashboard",
        "Activate the license in the IDE using your JetBrains account"
      ],
      applyLink: "https://www.jetbrains.com/community/education/#students"
    },
    {
      id: 4,
      name: "Figma for Education",
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
      eligibility: "Student or teacher email verification",
      benefits: [
        "Free Professional Plan",
        "Unlimited files and projects",
        "Advanced prototyping features",
        "Team collaboration tools"
      ],
      link: "https://www.figma.com/education/",
      category: "Design",
      details: "Figma for Education helps students learn UI/UX design, collaborate on group projects, and build interactive prototypes without any cost. Students gain access to Figma's Professional Plan features including unlimited files, advanced prototyping, team libraries, and plugins. This is invaluable for design students, computer science students working on app interfaces, marketing students creating visual content, and anyone interested in digital design. Figma is the industry-standard tool used by designers at companies like Google, Microsoft, and Uber, so learning it prepares students for real-world design careers. The real-time collaboration features make it perfect for group projects and remote teamwork.",
      howToApplySteps: [
        "Go to the Figma Education page",
        "Click on 'Get verified' for education",
        "Sign up or log in to your Figma account",
        "Enter your school-issued email address for automatic verification",
        "If automatic verification fails, submit documentation (student ID, enrollment letter, or school schedule)",
        "Wait for email confirmation (instant for .edu emails, 1-2 days for manual verification)",
        "Start using all Professional Plan features immediately after verification"
      ],
      applyLink: "https://www.figma.com/education/apply/"
    },
    {
      id: 5,
      name: "Notion Education Plan",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
      eligibility: ".edu or college domain email",
      benefits: [
        "Free Notion Plus plan",
        "Unlimited blocks and file uploads",
        "Advanced collaboration features",
        "Premium integrations"
      ],
      link: "https://www.notion.so/product/notion-for-education",
      category: "Productivity",
      details: "Notion for Education provides students with a powerful all-in-one workspace for notes, tasks, databases, and collaboration. Students can organize class notes, manage assignments, plan projects, build personal wikis, and collaborate with classmates—all in one place. The Plus plan includes unlimited blocks (no content limits), version history, and advanced permissions for team collaboration. This helps students stay organized throughout their academic journey, from tracking deadlines and studying for exams to managing research projects and group work. Notion's flexibility makes it suitable for all majors and use cases, whether organizing chemistry formulas, planning engineering projects, or drafting essays.",
      howToApplySteps: [
        "Visit the Notion Education page",
        "Click on 'Get Notion for free'",
        "Sign up with your school email address (.edu or institutional domain)",
        "Check your email for a verification link from Notion",
        "Click the verification link to confirm your student status",
        "Your account will automatically upgrade to the Plus plan",
        "Start creating pages, databases, and organizing your studies"
      ],
      applyLink: "https://www.notion.so/product/notion-for-education"
    },
    {
      id: 6,
      name: "Canva for Education",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg",
      eligibility: "Student or teacher verification",
      benefits: [
        "Free Canva Pro features",
        "Premium templates and elements",
        "Brand kit and resize magic",
        "Background remover tool"
      ],
      link: "https://www.canva.com/education/",
      category: "Design",
      details: "Canva for Education helps students design professional presentations, posters, infographics, social media graphics, resumes, portfolios, and creative projects with premium templates and tools. Students get access to millions of premium photos, graphics, videos, and fonts, plus advanced features like background remover, Magic Resize, and Brand Kit. This is perfect for students in any field who need to create visual content—from presentation slides for class to event posters, resume designs, social media content, and portfolio websites. The drag-and-drop interface makes professional design accessible even without prior design experience, and the templates provide excellent starting points for any project.",
      howToApplySteps: [
        "Go to the Canva for Education verification page",
        "Click on 'Verify for free Canva Pro'",
        "Sign up or log in to your Canva account",
        "Select 'I'm a student' as your role",
        "Enter your school email address or upload proof of enrollment",
        "For email verification: Check your inbox and click the verification link",
        "For document verification: Upload student ID or enrollment certificate and wait 1-3 days",
        "Once verified, access all Canva Pro features immediately"
      ],
      applyLink: "https://www.canva.com/education/"
    },
    {
      id: 7,
      name: "Autodesk Student Plan",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Autodesk_Logo.svg",
      eligibility: "Valid student ID or enrollment verification",
      benefits: [
        "Free AutoCAD",
        "Free Fusion 360",
        "Free Maya, 3ds Max",
        "All Autodesk software for 1 year"
      ],
      link: "https://www.autodesk.com/education/free-software",
      category: "3D & CAD",
      details: "Autodesk provides students with free access to professional-grade design software including AutoCAD for 2D/3D CAD, Fusion 360 for product design and manufacturing, Maya and 3ds Max for animation and visual effects, and many other industry-standard tools. This is essential for students in architecture, engineering, industrial design, animation, game design, and related fields. The software used by professionals at major architecture firms, engineering companies, game studios, and film production houses is available completely free to students. This hands-on experience with industry tools gives students a competitive advantage when entering the job market and allows them to build impressive portfolios.",
      howToApplySteps: [
        "Visit the Autodesk Education Community website",
        "Click on 'Get started' or 'Sign in'",
        "Create an Autodesk account using your school email address",
        "Select your role as 'Student'",
        "Fill in your educational information (school name, graduation date)",
        "Verify your student status by providing documentation (student ID, enrollment letter, or transcript)",
        "Once verified, browse available software and click 'Get product' for any Autodesk tool",
        "Download and install the software with your educational license (valid for 1 year, renewable)"
      ],
      applyLink: "https://www.autodesk.com/education/edu-software/overview"
    },
    {
      id: 8,
      name: "Unity Student Plan",
      logo: "https://cdn.worldvectorlogo.com/logos/unity-69.svg",
      eligibility: "Student verification (age 16+)",
      benefits: [
        "Unity Pro tools and features",
        "Advanced analytics",
        "Cloud Build capabilities",
        "Premium support resources"
      ],
      link: "https://store.unity.com/academic",
      category: "Game Development",
      details: "Unity Student Plan provides aspiring game developers with professional-grade game development tools used to create popular games and interactive experiences across mobile, desktop, console, and VR/AR platforms. Students gain access to Unity Pro features including advanced analytics, Cloud Build for automated builds, custom splash screen, and premium support. This is invaluable for students studying game design, computer science, interactive media, or anyone interested in creating games, simulations, or virtual experiences. Unity powers thousands of games including Pokémon GO, Monument Valley, and Among Us, making it an essential skill for game industry careers.",
      howToApplySteps: [
        "Visit the Unity Student Plan page",
        "Click on 'Get started' for students",
        "Create a Unity ID or sign in to your existing account",
        "Verify that you are 16 years or older",
        "Provide your educational institution information",
        "Upload proof of enrollment (student ID, enrollment certificate, or schedule)",
        "Wait for verification approval (typically 1-3 business days)",
        "Once approved, download Unity Hub and install Unity with your Student license",
        "Start creating games and interactive experiences with Pro features"
      ],
      applyLink: "https://store.unity.com/academic/unity-student"
    },
    {
      id: 9,
      name: "AWS Educate",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
      eligibility: "Students 16+ years old",
      benefits: [
        "Cloud credits for AWS services",
        "Free hands-on labs and tutorials",
        "Job board access",
        "Learning pathways and badges"
      ],
      link: "https://aws.amazon.com/education/awseducate/",
      category: "Cloud",
      details: "AWS Educate provides students with free cloud computing resources, hands-on labs, learning content, and career pathways to build cloud skills. Students receive AWS credits to experiment with cloud services like EC2, S3, Lambda, and more—the same services used by Netflix, Airbnb, and NASA. The program includes self-paced labs, courses on cloud computing, machine learning, cybersecurity, and other in-demand skills, plus access to a job board featuring cloud-related positions. This is essential for students in computer science, IT, data science, or business who want to understand cloud technology that powers modern applications and enterprises.",
      howToApplySteps: [
        "Go to the AWS Educate website",
        "Click on 'Join AWS Educate'",
        "Select 'Student' as your role",
        "Create an AWS Educate account (separate from regular AWS account)",
        "Enter your school information and expected graduation date",
        "Provide your school-issued email address for verification",
        "If you don't have a school email, upload proof of enrollment",
        "Wait for approval email (usually within 24-48 hours)",
        "Once approved, log in to access cloud credits, labs, and learning content",
        "Start building cloud projects and earning digital badges"
      ],
      applyLink: "https://aws.amazon.com/education/awseducate/"
    },
    {
      id: 10,
      name: "Namecheap Student Domain",
      logo: "https://www.namecheap.com/assets/img/nc-icon/logo.svg",
      eligibility: "GitHub Student Pack member",
      benefits: [
        "Free .me domain for 1 year",
        "Free SSL certificate",
        "WhoisGuard privacy protection",
        "Access via GitHub Student Pack"
      ],
      link: "https://education.github.com/pack#namecheap",
      category: "Domains",
      details: "Namecheap's student offer through the GitHub Student Developer Pack provides students with a free .me domain name and SSL certificate for one year, perfect for building a personal website, portfolio, blog, or online resume. Students also get WhoisGuard privacy protection to keep their personal information secure. Having a personal domain helps students establish their online presence, showcase their work to potential employers, host projects, and build their personal brand. This is particularly valuable for students in web development, design, digital marketing, or anyone building a professional portfolio.",
      howToApplySteps: [
        "First, get approved for the GitHub Student Developer Pack (see GitHub Pack instructions)",
        "Once approved, visit your GitHub Education Pack benefits page",
        "Find Namecheap in the list of partner offers",
        "Click 'Get access' or the redemption link for Namecheap",
        "You'll receive a unique coupon code for your free domain",
        "Visit Namecheap.com and create an account or log in",
        "Search for and select your desired .me domain name",
        "Apply your GitHub Student Pack coupon code at checkout",
        "Complete registration and start using your free domain and SSL certificate"
      ],
      applyLink: "https://education.github.com/pack#offers"
    },
    {
      id: 11,
      name: "Adobe Creative Cloud (Student Discount)",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Adobe_Creative_Cloud_rainbow_icon.svg",
      eligibility: "University/College student",
      benefits: [
        "60–70% discount on full Creative Cloud suite",
        "Access to Photoshop, Illustrator, Premiere Pro, After Effects",
        "20GB cloud storage",
        "Adobe Fonts library access"
      ],
      link: "https://www.adobe.com/creativecloud/buy/students.html",
      category: "Design",
      details: "Adobe Creative Cloud Student Discount provides college and university students with professional-grade creative tools at a fraction of the regular cost. Students gain access to industry-standard applications used by designers, photographers, video editors, and content creators worldwide. With over 20 desktop and mobile apps including Photoshop for photo editing, Illustrator for vector graphics, Premiere Pro for video editing, and After Effects for motion graphics, students can create stunning presentations, portfolios, marketing materials, videos, and creative projects. This discount is essential for students in graphic design, marketing, film production, digital arts, and anyone building a creative portfolio to showcase their work to future employers.",
      howToApplySteps: [
        "Visit the Adobe Creative Cloud Student Pricing page",
        "Click on 'Buy now' for students and teachers",
        "Create an Adobe account or sign in if you already have one",
        "Select your plan (All Apps is recommended for full access)",
        "Verify your student status using your school-issued email address (.edu domain)",
        "If email verification is not available, upload proof of enrollment (student ID, transcript, or enrollment letter)",
        "Complete payment with your discounted student rate (60-70% off)",
        "Download the Creative Cloud desktop app and start installing applications",
        "Your student discount remains valid as long as you maintain student status (renewable annually)"
      ],
      applyLink: "https://www.adobe.com/creativecloud/buy/students.html"
    },
    {
      id: 12,
      name: "Miro Education Plan",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Miro_app_logo.svg",
      eligibility: "Student or teacher verification",
      benefits: [
        "Free Miro Team Plan",
        "Unlimited boards and collaborators",
        "Premium templates and frameworks",
        "Video chat and presentation mode"
      ],
      link: "https://miro.com/education/",
      category: "Collaboration",
      details: "Miro Education Plan provides students with a powerful visual collaboration platform perfect for brainstorming, mind mapping, group assignments, project planning, and design thinking exercises. The Team Plan includes unlimited boards, real-time collaboration with classmates, hundreds of templates for various use cases (from SWOT analysis to user story mapping), sticky notes, shapes, connectors, and presentation mode. This is invaluable for group projects, remote team collaboration, visualizing complex concepts, planning events, organizing research, creating flowcharts, and conducting virtual workshops. Students in business, design, engineering, and any field requiring visual collaboration will find Miro essential for organizing ideas and working effectively with teams.",
      howToApplySteps: [
        "Go to the Miro Education website",
        "Click on 'Get Miro for free' or 'Apply for education'",
        "Create a Miro account or sign in to your existing account",
        "Select your role as 'Student' or 'Teacher'",
        "Enter your educational institution information",
        "Verify your status using your school email address (.edu or institutional domain)",
        "If automatic verification fails, upload documentation (student ID, enrollment letter, or class schedule)",
        "Wait for approval confirmation email (usually within 24-48 hours)",
        "Once approved, your account will upgrade to the Team Plan automatically",
        "Start creating boards and invite your classmates to collaborate"
      ],
      applyLink: "https://miro.com/education/"
    },
    {
      id: 13,
      name: "Canva Nonprofit for Student Clubs",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg",
      eligibility: "Recognized student organization or NGO",
      benefits: [
        "Free Canva Pro for nonprofit organizations",
        "Premium templates and brand kit",
        "Team collaboration features",
        "Background remover and Magic Resize"
      ],
      link: "https://www.canva.com/canva-for-nonprofits/",
      category: "Design",
      details: "Canva for Nonprofits helps student-run organizations, clubs, and NGOs create professional designs for events, campaigns, social media, fundraising materials, and community outreach without any cost. Student organizations can design event posters, social media graphics, presentation slides, newsletters, infographics, merchandise designs, and marketing materials using millions of premium templates, photos, graphics, and fonts. This is perfect for student clubs focused on social impact, community service, activism, entrepreneurship, or any cause-driven initiative. The team features allow multiple club members to collaborate on designs, maintain brand consistency, and create impactful visual content to support their mission.",
      howToApplySteps: [
        "Visit the Canva for Nonprofits application page",
        "Click on 'Apply now' for nonprofit organizations",
        "Ensure your student organization is registered as a nonprofit or has official club status",
        "Create a Canva account using your club's official email or your student email",
        "Fill out the nonprofit application form with your organization details",
        "Provide your organization's registration documents, club charter, or official recognition letter",
        "Submit proof of your nonprofit status or student organization charter",
        "Wait for Canva to review your application (typically 14-30 days)",
        "Once approved, your team will receive Canva Pro access for free",
        "Invite your club members to join your Canva team and start creating"
      ],
      applyLink: "https://www.canva.com/canva-for-nonprofits/"
    },
    {
      id: 14,
      name: "Replit Hacker Plan for Students",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Repl.it_logo.svg",
      eligibility: "Student email verification",
      benefits: [
        "Free Replit Hacker plan",
        "More computing power and storage",
        "Private repls and deployments",
        "Multiplayer coding collaboration"
      ],
      link: "https://replit.com/site/teams-for-education",
      category: "Development",
      details: "Replit Hacker Plan for Students provides a powerful online coding environment where students can write, run, and deploy code directly in the browser without setting up complex development environments. Students can code in over 50 programming languages, collaborate in real-time with classmates on coding assignments, deploy web applications instantly, and build portfolios of projects. This is essential for computer science students, coding bootcamp participants, and anyone learning to program. The Hacker plan includes more computing resources, private code repositories, faster execution, and the ability to deploy applications that can be shared with professors or potential employers. No installation required—just open a browser and start coding.",
      howToApplySteps: [
        "Visit the Replit Teams for Education page",
        "Click on 'Sign up' or 'Get started for free'",
        "Create a Replit account using your school email address",
        "Navigate to account settings or education benefits section",
        "Apply for the student Hacker plan by verifying your student status",
        "Enter your educational institution information and expected graduation date",
        "Verify your school email address by clicking the confirmation link",
        "Once verified, your account will automatically upgrade to Hacker plan",
        "Start creating repls, join coding classrooms, and deploy your projects",
        "Explore multiplayer coding for group assignments and pair programming"
      ],
      applyLink: "https://replit.com/site/teams-for-education"
    },
    {
      id: 15,
      name: "Wolfram Alpha Pro for Students",
      logo: "https://www.wolframalpha.com/_next/static/images/share_JcVTAqbV.png",
      eligibility: "Valid school or university affiliation",
      benefits: [
        "Full AI computational engine",
        "Step-by-step solutions",
        "Extended computation time",
        "Downloadable results and data"
      ],
      link: "https://www.wolframalpha.com/pro/",
      category: "Education",
      details: "Wolfram Alpha Pro provides students with an incredibly powerful computational knowledge engine that solves complex math problems, physics equations, chemistry calculations, statistical analyses, and much more with detailed step-by-step explanations. Unlike simple calculators, Wolfram Alpha understands natural language queries and can help with calculus, differential equations, linear algebra, proofs, unit conversions, data analysis, and scientific computations. This is invaluable for STEM students who need help understanding problem-solving methods, verifying homework answers, visualizing mathematical concepts, and learning the logical steps behind solutions. The Pro version includes extended computation time, downloadable results, and access to Wolfram notebooks for interactive learning.",
      howToApplySteps: [
        "Visit the Wolfram Alpha Pro website",
        "Click on 'Upgrade' or 'Get Pro'",
        "Select the 'Students & Educators' discount option",
        "Create a Wolfram account or sign in to your existing account",
        "Verify your student status using your school-issued email address",
        "Provide your educational institution details and enrollment information",
        "If additional verification is needed, upload your student ID or enrollment certificate",
        "Complete payment for the discounted student subscription",
        "Start using step-by-step solutions, extended computation features, and downloadable results",
        "Explore Wolfram notebooks for interactive problem-solving and learning"
      ],
      applyLink: "https://www.wolframalpha.com/pro/"
    },
    {
      id: 16,
      name: "Overleaf Student Collaborator Pack",
      logo: "https://images.ctfassets.net/nrgyaltdicpt/h9dpHuVys19B1sOAWvbP6/5f8d4c6d051f63e4ba450befd56f9189/ologo_square_colour_light_bg.svg",
      eligibility: "University domain email",
      benefits: [
        "More collaborators per project",
        "Full document history and version control",
        "Priority compilation",
        "Advanced reference management"
      ],
      link: "https://www.overleaf.com/edu",
      category: "Research",
      details: "Overleaf Student Collaborator Pack provides students with a professional LaTeX editor perfect for writing academic papers, theses, research reports, mathematical proofs, and technical documentation. The platform offers real-time collaboration with advisors and classmates, hundreds of journal templates, automatic formatting for citations and bibliographies, and seamless integration with reference managers like Zotero and Mendeley. This is essential for graduate students, researchers, students in mathematics, physics, computer science, engineering, and anyone writing academic papers with complex equations, figures, and references. The student pack includes more collaborators per document, full revision history to track changes, and priority compilation for faster document processing.",
      howToApplySteps: [
        "Go to the Overleaf Education website",
        "Click on 'Register' or 'Verify student status'",
        "Create an Overleaf account using your university email address (@university.edu)",
        "Check your university email for a verification link from Overleaf",
        "Click the verification link to confirm your student status",
        "Your account will automatically upgrade with student benefits",
        "If your university has an institutional license, additional features may be unlocked automatically",
        "Start creating LaTeX projects using templates for papers, theses, and presentations",
        "Invite collaborators (advisors, classmates) to work on documents together",
        "Use the rich text editor if you're new to LaTeX, or switch to source code for advanced control"
      ],
      applyLink: "https://www.overleaf.com/edu"
    },
    {
      id: 17,
      name: "Notability Note-Taking (Student Discount)",
      logo: "https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/ae/a4/5f/aea45f5f-7f3e-3b5e-3e3b-0c3b5e3b5e3b/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/230x0w.webp",
      eligibility: "Student ID verification",
      benefits: [
        "50% off yearly subscription",
        "Handwriting and typing combined",
        "Audio recording synced with notes",
        "Cross-device sync via iCloud"
      ],
      link: "https://www.gingerlabs.com/notability",
      category: "Productivity",
      details: "Notability Student Discount provides students with one of the most powerful digital note-taking apps for iPad, Mac, and iPhone at half the regular price. Students can take handwritten notes with Apple Pencil, type text, annotate PDFs, record lectures with audio that syncs to handwritten notes, organize notes by subject and topic, and access everything across all devices. This is perfect for students who want to go paperless, annotate textbooks and research papers, sketch diagrams and equations, record and review lectures, and keep all class materials organized in one place. The audio recording feature is especially valuable—tap on any note and hear what the professor said at that exact moment during the lecture.",
      howToApplySteps: [
        "Download Notability from the App Store (iOS/Mac)",
        "Open the app and create a new account or sign in",
        "Navigate to Settings and look for 'Student Discount' or subscription options",
        "Select the student subscription plan",
        "Verify your student status by uploading a photo of your student ID",
        "Alternatively, verify using your school email address if supported",
        "Once verified, you'll receive 50% off the yearly subscription price",
        "Complete payment through the App Store",
        "Start taking notes, recording lectures, and annotating documents",
        "Enable iCloud sync to access your notes across all your Apple devices"
      ],
      applyLink: "https://www.gingerlabs.com/notability"
    },
    {
      id: 18,
      name: "Spotify Premium Student",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
      eligibility: "Student verification (SheerID)",
      benefits: [
        "50% discount on Premium subscription",
        "Ad-free music streaming",
        "Offline downloads",
        "High-quality audio"
      ],
      link: "https://www.spotify.com/student/",
      category: "Lifestyle",
      details: "Spotify Premium Student provides college and university students with unlimited ad-free music streaming at half the regular price. Students can listen to millions of songs, create custom playlists for studying or relaxation, download music for offline listening during commutes, enjoy high-quality audio, and discover new music based on their preferences. This is perfect for students who want background music while studying, motivation during workouts, or entertainment during long study sessions. The student plan helps students save money while enjoying premium features that enhance focus, productivity, and well-being. Music has been shown to improve mood, reduce stress, and help with concentration during studying.",
      howToApplySteps: [
        "Visit the Spotify Premium Student page",
        "Click on 'Get Premium Student'",
        "Log in to your Spotify account or create a new account",
        "Click 'Verify eligibility' to start the student verification process",
        "You'll be redirected to SheerID for verification",
        "Enter your school information (university name, country, date of birth)",
        "Provide documentation to verify enrollment (upload transcript, class schedule, or use school email)",
        "Wait for SheerID to verify your student status (usually instant or within 24 hours)",
        "Once verified, complete payment for the discounted Premium Student plan",
        "Start enjoying ad-free music, offline downloads, and unlimited skips",
        "Re-verify your student status annually to maintain the discount (up to 4 years)"
      ],
      applyLink: "https://www.spotify.com/student/"
    },
    {
      id: 19,
      name: "Apple Music Student Plan",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Apple_Music_logo.svg",
      eligibility: "University student verification",
      benefits: [
        "Discounted Apple Music subscription",
        "Access to 100 million songs",
        "Ad-free listening and offline downloads",
        "Exclusive content and live radio"
      ],
      link: "https://www.apple.com/apple-music/",
      category: "Entertainment",
      details: "Apple Music Student Plan offers university students access to one of the world's largest music streaming libraries at a significantly discounted rate. Students can stream over 100 million songs, listen to curated playlists for studying and relaxation, download music for offline listening, enjoy spatial audio with Dolby Atmos, access exclusive content and interviews, and listen to live radio stations. This subscription is ideal for students who want high-quality music during study sessions, commutes, workouts, or downtime. Apple Music integrates seamlessly with Apple devices and Siri, making it easy to control playback hands-free while studying or working on projects.",
      howToApplySteps: [
        "Visit the Apple Music website or open the Music app on your iPhone/iPad",
        "Look for the Student subscription option",
        "Tap on 'Subscribe' or 'Get Apple Music'",
        "Select the 'University Student' plan",
        "You'll be redirected to UNiDAYS for student verification",
        "Create a UNiDAYS account or sign in if you already have one",
        "Enter your university information and verify your enrollment status",
        "Provide documentation if required (student email, ID, or enrollment proof)",
        "Once verified by UNiDAYS, return to Apple Music",
        "Complete the subscription purchase at the discounted student rate",
        "Start streaming ad-free music across all your devices",
        "Re-verify annually through UNiDAYS to maintain the student discount (up to 4 years)"
      ],
      applyLink: "https://www.apple.com/apple-music/"
    },
    {
      id: 20,
      name: "LastPass Premium for Students",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/LastPass_logo.svg",
      eligibility: "US/Global student verification",
      benefits: [
        "Free Premium password manager",
        "Unlimited password storage",
        "Multi-device sync",
        "Dark web monitoring and security alerts"
      ],
      link: "https://www.lastpass.com/edu",
      category: "Security",
      details: "LastPass Premium for Students provides college students with a powerful password management solution to keep all their online accounts secure. Students can store unlimited passwords in an encrypted vault, generate strong unique passwords for every account, autofill login credentials on websites and apps, sync passwords across all devices, share passwords securely with classmates for group projects, and receive alerts if passwords are compromised in data breaches. This is essential for students managing dozens of accounts (school portals, email, cloud storage, social media, banking) and helps prevent security breaches, identity theft, and the common mistake of reusing passwords. Good password hygiene is a critical skill for digital safety in academic and professional life.",
      howToApplySteps: [
        "Visit the LastPass for Education website",
        "Click on 'Get Started' or 'Apply for student discount'",
        "Create a LastPass account using your school email address",
        "Download the LastPass browser extension and mobile app",
        "Verify your student status through the verification system",
        "Provide your university information and expected graduation date",
        "Upload documentation if required (student ID, enrollment letter, or transcript)",
        "Wait for verification approval (typically 1-3 business days)",
        "Once approved, your account will upgrade to Premium automatically",
        "Start importing passwords and securing your digital accounts",
        "Enable multi-factor authentication for extra security on your vault"
      ],
      applyLink: "https://www.lastpass.com/edu"
    },
    {
      id: 21,
      name: "Autodesk Fusion Academy Plan",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/9e/Autodesk_Logo.svg",
      eligibility: "Students in engineering or design programs",
      benefits: [
        "Free Autodesk Fusion 360 for students",
        "CAD, CAM, and CAE tools in one platform",
        "Cloud collaboration features",
        "Access to learning resources and tutorials"
      ],
      link: "https://www.autodesk.com/education/edu-software/overview",
      category: "Engineering",
      details: "Autodesk Fusion Academy Plan provides engineering and design students with free access to Fusion 360, a comprehensive 3D CAD/CAM/CAE software used for product design, mechanical engineering, industrial design, and manufacturing. Students can design parts and assemblies, simulate mechanical performance, generate toolpaths for CNC machining, collaborate with team members on cloud-based projects, and learn industry workflows used by professional engineers and designers. This is essential for students in mechanical engineering, industrial design, product design, manufacturing, and related fields. Fusion 360 combines parametric modeling, generative design, simulation, and manufacturing tools in one integrated platform—skills highly valued by employers in automotive, aerospace, consumer products, and manufacturing industries.",
      howToApplySteps: [
        "Visit the Autodesk Education Community website",
        "Click on 'Get started' or 'Sign in to education access'",
        "Create an Autodesk account with your school email address",
        "Select your role as 'Student'",
        "Choose 'Fusion 360' from the list of available software products",
        "Provide your educational institution information and expected graduation date",
        "Verify your student status using uploaded documentation (student ID, enrollment letter, or transcript)",
        "Once verified, click 'Get product' next to Fusion 360",
        "Download and install Fusion 360 with your educational license (valid for 1 year, renewable)",
        "Access free learning resources, tutorials, and sample projects to build your skills",
        "Join the Autodesk student community for support and inspiration"
      ],
      applyLink: "https://www.autodesk.com/education/edu-software/overview"
    },
    {
      id: 22,
      name: "Oracle Cloud Free Tier for Students",
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg",
      eligibility: "Student verification",
      benefits: [
        "30-day trial with $300 free credits",
        "Always-free cloud services",
        "Access to compute, storage, and database resources",
        "Learning resources and certifications"
      ],
      link: "https://www.oracle.com/cloud/free/",
      category: "Cloud",
      details: "Oracle Cloud Free Tier provides students with access to Oracle's enterprise-grade cloud infrastructure for learning, experimentation, and building cloud-native applications. Students receive $300 in credits for 30 days to explore all cloud services, plus always-free resources including compute instances, databases, object storage, and more. This is invaluable for students studying cloud computing, database management, DevOps, cybersecurity, or enterprise IT. Oracle Cloud is used by Fortune 500 companies, so gaining hands-on experience helps students build job-ready skills in cloud infrastructure, database administration, application deployment, and data analytics. The free tier allows students to host websites, deploy applications, run databases, and experiment without worrying about costs.",
      howToApplySteps: [
        "Visit the Oracle Cloud Free Tier website",
        "Click on 'Start for free' or 'Sign up'",
        "Create an Oracle account with your email address (school email recommended)",
        "Provide your personal information and country",
        "Enter a credit card for identity verification (you won't be charged unless you upgrade)",
        "Verify your account through email confirmation",
        "Complete the sign-up process and access the Oracle Cloud console",
        "Explore the $300 free credits for 30 days and always-free tier resources",
        "Take advantage of free training courses and Oracle certifications for students",
        "Start building projects using compute instances, databases, networking, and storage services"
      ],
      applyLink: "https://www.oracle.com/cloud/free/"
    },
    {
      id: 23,
      name: "IBM Academic Initiative",
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
      eligibility: "Students with official institution email",
      benefits: [
        "Free IBM Cloud credits",
        "Access to Watson AI and quantum computing tools",
        "Course materials and certifications",
        "Hands-on labs and projects"
      ],
      link: "https://www.ibm.com/academic",
      category: "Cloud/AI",
      details: "IBM Academic Initiative provides students with free access to IBM Cloud services, Watson AI tools, quantum computing platforms, enterprise software, and professional learning resources. Students can experiment with cutting-edge technologies including artificial intelligence, machine learning, natural language processing, quantum computing, blockchain, cybersecurity, and data analytics. This is essential for students in computer science, data science, AI/ML, cybersecurity, and business analytics who want to gain hands-on experience with enterprise-grade technologies used by Fortune 500 companies. IBM offers certifications, badges, and project-based learning that strengthen resumes and demonstrate practical skills to future employers. The quantum computing access is particularly unique, allowing students to run algorithms on real quantum hardware.",
      howToApplySteps: [
        "Visit the IBM Academic Initiative website",
        "Click on 'Join now' or 'Register'",
        "Create an IBM account using your school-issued email address",
        "Fill out the academic registration form with your institution details",
        "Select the resources and tools you're interested in (Watson AI, Cloud, Quantum, etc.)",
        "Wait for approval from IBM (typically 1-3 business days)",
        "Once approved, access your IBM Cloud dashboard and redeem your credits",
        "Explore Watson Studio for AI/ML projects and IBM Quantum Experience for quantum computing",
        "Complete free courses and earn digital badges and certifications",
        "Join the IBM developer community for tutorials, webinars, and support"
      ],
      applyLink: "https://www.ibm.com/academic"
    },
    {
      id: 24,
      name: "Google Cloud Skills Boost for Students",
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg",
      eligibility: "School email verification",
      benefits: [
        "Free training paths and learning content",
        "Google Cloud credits for hands-on labs",
        "Skill badges and certifications",
        "Career resources and job pathways"
      ],
      link: "https://www.cloudskillsboost.google/",
      category: "Cloud",
      details: "Google Cloud Skills Boost for Students provides free access to structured learning paths, hands-on labs, and credits for Google Cloud Platform (GCP) services. Students can learn cloud computing, data analytics, machine learning, cybersecurity, Kubernetes, and DevOps through interactive labs and real-world projects. This is crucial for students pursuing careers in cloud engineering, data science, DevOps, or software development, as Google Cloud powers companies like Spotify, Twitter, Snapchat, and PayPal. Students earn skill badges by completing quests, build practical experience with GCP tools, and prepare for Google Cloud certifications that are highly valued by employers. The platform combines theoretical learning with hands-on practice using actual Google Cloud infrastructure.",
      howToApplySteps: [
        "Visit the Google Cloud Skills Boost website",
        "Click on 'Sign in' or 'Get started'",
        "Sign up using your Google account (preferably with school email)",
        "Look for student programs or education offers on the platform",
        "Verify your student status if prompted (through school email or documentation)",
        "Explore free learning paths, quests, and hands-on labs",
        "Redeem any available student credits for Google Cloud Platform",
        "Complete labs and quests to earn skill badges",
        "Track your progress and build a portfolio of completed projects",
        "Consider pursuing Google Cloud certifications to validate your skills"
      ],
      applyLink: "https://www.cloudskillsboost.google/"
    },
    {
      id: 25,
      name: "LinkedIn Learning (Campus Offer)",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/01/LinkedIn_Logo.svg",
      eligibility: "If college partners with LinkedIn",
      benefits: [
        "Full LinkedIn Learning library access",
        "Thousands of courses on business, tech, and creative skills",
        "Certificates of completion",
        "Mobile app access for learning on-the-go"
      ],
      link: "https://www.linkedin.com/learning/",
      category: "Learning",
      details: "LinkedIn Learning Campus Offer provides students at partner institutions with unlimited access to thousands of professional development courses covering business skills, technology, creative tools, and soft skills. Students can learn in-demand skills like Excel, Python, data analysis, project management, leadership, marketing, video editing, and more—all taught by industry experts. This is incredibly valuable for students preparing for internships and careers, as LinkedIn Learning courses come with certificates that can be added directly to LinkedIn profiles. The platform helps students develop both technical and soft skills, stay competitive in the job market, and explore different career paths. Many universities partner with LinkedIn to provide free access to all enrolled students.",
      howToApplySteps: [
        "Check if your college or university has a partnership with LinkedIn Learning",
        "Visit your university's IT portal, library website, or student resources page",
        "Look for 'LinkedIn Learning' or 'Lynda.com' access instructions",
        "Log in using your school credentials (SSO or university portal)",
        "If available, you'll be redirected to LinkedIn Learning with full access",
        "Create or link your LinkedIn account to track completed courses",
        "Browse the course library and create a learning plan based on your interests",
        "Complete courses and add certificates to your LinkedIn profile",
        "Download the LinkedIn Learning mobile app for learning on-the-go",
        "If your school doesn't partner with LinkedIn, contact your library or IT department to request access"
      ],
      applyLink: "https://www.linkedin.com/learning/"
    },
    {
      id: 26,
      name: "Unity Learn Student Plan",
      logo: "https://cdn.worldvectorlogo.com/logos/unity-69.svg",
      eligibility: "Student verification",
      benefits: [
        "Full Unity learning platform access",
        "Guided project kits and tutorials",
        "Unity Certification prep materials",
        "Exclusive student resources"
      ],
      link: "https://unity.com/products/unity-student-plan",
      category: "Game Development",
      details: "Unity Learn Student Plan provides aspiring game developers with comprehensive learning resources, project kits, and tutorials to master Unity—the world's leading game development platform. Students get access to curated learning pathways, hands-on projects, certification preparation materials, and exclusive student content covering game design, 2D/3D development, VR/AR creation, animation, physics, and scripting. This is essential for students studying game development, computer science, interactive media, or anyone interested in creating games, simulations, or immersive experiences. Unity is used to develop thousands of popular games across mobile, console, PC, and VR platforms. Learning Unity opens career opportunities in game studios, VR/AR companies, simulation development, and interactive media.",
      howToApplySteps: [
        "Visit the Unity Student Plan website",
        "Click on 'Get started' or 'Verify student status'",
        "Create a Unity ID or sign in to your existing Unity account",
        "Navigate to the student verification section",
        "Provide your educational institution information",
        "Verify your student status using documentation (student ID, enrollment letter, or school email)",
        "Wait for verification approval (typically 1-3 business days)",
        "Once approved, access Unity Learn with full student benefits",
        "Explore learning pathways, complete projects, and build a portfolio",
        "Download Unity Hub and start creating games with the Unity Editor",
        "Consider working toward Unity Certified User or Unity Certified Associate certifications"
      ],
      applyLink: "https://unity.com/products/unity-student-plan"
    },
    {
      id: 27,
      name: "Unreal Engine Learning Resources",
      logo: "https://cdn2.unrealengine.com/ue-logo-1400x788-1400x788-8f185e1e3635.jpg",
      eligibility: "Free for everyone (student-friendly)",
      benefits: [
        "Free access to Unreal Engine 5",
        "Comprehensive learning library and tutorials",
        "Sample projects and templates",
        "Community support and forums"
      ],
      link: "https://www.unrealengine.com/",
      category: "Game Development",
      details: "Unreal Engine Learning Resources provide students with free access to one of the most powerful game engines used to create AAA games, films, architectural visualizations, and virtual production experiences. Unreal Engine 5 is completely free for learning and development, with extensive documentation, video tutorials, learning paths, and sample projects covering game development, real-time 3D rendering, VR/AR, cinematics, and more. This is invaluable for students in game development, computer graphics, film production, architecture, and interactive media. Unreal Engine powers blockbuster games like Fortnite and is used by studios like Disney, Netflix, and Porsche for virtual production. Students can build photorealistic environments, develop games, create architectural walkthroughs, and build impressive portfolio projects using industry-standard tools.",
      howToApplySteps: [
        "Visit the Unreal Engine website",
        "Click on 'Download' or 'Get started'",
        "Create an Epic Games account (completely free, no verification needed)",
        "Download the Epic Games Launcher for your operating system",
        "Install the Epic Games Launcher and sign in",
        "Navigate to the Unreal Engine section and install Unreal Engine 5",
        "Access the 'Learn' tab to explore tutorials, courses, and learning paths",
        "Download sample projects and templates to study professional workflows",
        "Join the Unreal Engine community forums and Discord for support",
        "Start creating games, visualizations, or cinematic experiences",
        "Publish your projects for free (royalties only apply after significant revenue)"
      ],
      applyLink: "https://www.unrealengine.com/"
    }
  ];

  // Find the software by ID
  const software = studentBenefits.find((item) => item.id === softwareId);

  // Handle not found
  if (!software) {
    return (
      <div className="min-h-screen bg-cyber-darker flex items-center justify-center">
        <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl max-w-md">
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Software Not Found
            </h2>
            <p className="text-muted-foreground mb-6">
              The software benefit you're looking for doesn't exist.
            </p>
            <Link href="/offers">
              <Button className="bg-gradient-to-r from-neon-cyan to-neon-purple text-black font-semibold">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Offers
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleApplyNow = () => {
    window.open(software.applyLink || software.link, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-cyber-darker">
      <div className="w-full py-6 px-6 max-w-6xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              href="/offers"
              className="hover:text-neon-cyan transition-colors flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              Offers
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">{software.name}</span>
          </nav>
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <Link href="/offers">
            <Button
              variant="outline"
              className="bg-cyber-card/50 border-cyber-border hover:border-neon-cyan/30"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Benefits
            </Button>
          </Link>
        </div>

        {/* Header Section */}
        <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl mb-6">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Logo */}
              <div className="w-24 h-24 rounded-lg bg-cyber-darker/50 border border-cyber-border flex items-center justify-center p-3 overflow-hidden flex-shrink-0">
                {software.logo ? (
                  <img
                    src={software.logo}
                    alt={`${software.name} logo`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded flex items-center justify-center">
                    <span className="text-3xl font-bold text-neon-cyan">
                      {software.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Title and Category */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                  {software.name}
                </h1>
                {software.category && (
                  <Badge className="bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30 text-sm px-3 py-1">
                    {software.category}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* How This Helps Students */}
            <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <div className="w-1 h-8 bg-gradient-to-b from-neon-cyan to-neon-purple rounded-full" />
                  How This Helps Students
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {software.details}
                </p>
              </CardContent>
            </Card>

            {/* Benefits Section */}
            <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-neon-purple" />
                  What You Get
                </h2>
                <div className="space-y-3">
                  {(Array.isArray(software.benefits)
                    ? software.benefits
                    : [software.benefits]
                  ).map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-neon-cyan mt-0.5 flex-shrink-0" />
                      <p className="text-muted-foreground">{benefit}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* How to Apply Section */}
            <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                    <span className="text-sm font-bold text-black">?</span>
                  </div>
                  How to Apply
                </h2>

                {software.howToApplySteps && software.howToApplySteps.length > 0 ? (
                  <div className="space-y-5">
                    {software.howToApplySteps.map((step, idx) => (
                      <div key={idx} className="flex gap-4">
                        {/* Step Number */}
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-neon-cyan/20 border-2 border-neon-cyan/30 flex items-center justify-center">
                            <span className="text-base font-bold text-neon-cyan">
                              {idx + 1}
                            </span>
                          </div>
                        </div>

                        {/* Step Content */}
                        <div className="flex-1 pt-2">
                          <p className="text-foreground">{step}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Visit the official website for application instructions.
                  </p>
                )}

                <Separator className="bg-cyber-border my-6" />

                {/* Apply Now Button */}
                <Button
                  onClick={handleApplyNow}
                  className="w-full bg-gradient-to-r from-neon-cyan to-neon-purple text-black font-semibold text-lg py-6 hover:shadow-lg hover:shadow-neon-cyan/20 transition-all duration-300"
                >
                  Apply Now
                  <ExternalLink className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Eligibility Card */}
            <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl sticky top-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-neon-cyan" />
                  Eligibility
                </h3>
                <p className="text-muted-foreground">{software.eligibility}</p>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button
                    onClick={handleApplyNow}
                    className="w-full bg-gradient-to-r from-neon-cyan to-neon-purple text-black font-semibold"
                  >
                    Apply Now
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    onClick={() => window.open(software.link, "_blank")}
                    variant="outline"
                    className="w-full bg-cyber-darker/50 border-cyber-border hover:border-neon-purple/30"
                  >
                    Visit Website
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                  <Link href="/offers" className="block">
                    <Button
                      variant="outline"
                      className="w-full bg-cyber-darker/50 border-cyber-border hover:border-neon-cyan/30"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Browse More Benefits
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Category Info */}
            <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-3">
                  Category
                </h3>
                <Badge className="bg-neon-purple/20 text-neon-purple border-neon-purple/30 text-sm px-3 py-1">
                  {software.category}
                </Badge>
                <p className="text-sm text-muted-foreground mt-3">
                  Browse more benefits in the {software.category} category
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
