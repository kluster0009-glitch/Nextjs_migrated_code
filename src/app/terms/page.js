import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Terms & Conditions | Kluster",
  description: "Terms & Conditions for Kluster",
};

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-cyber-dark cyber-bg py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-4xl bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
              Terms & Conditions
            </CardTitle>
            <CardDescription>Last Updated: 17 Nov 2025</CardDescription>
          </CardHeader>

          <CardContent className="prose prose-invert max-w-none">
            <p className="text-lg">
              Welcome to Kluster. By accessing or using Kluster, you agree to
              the following Terms & Conditions. If you do not agree, please stop
              using the platform.
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                1. Eligibility
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  You must be a student, faculty, or authorized member of the
                  participating college or institution.
                </li>
                <li>You must be at least 16 years old.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                2. User Accounts
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  You are responsible for safeguarding your login ID and
                  password.
                </li>
                <li>
                  You must provide accurate details including name, department,
                  and institutional email.
                </li>
                <li>
                  You agree not to impersonate others or create fake accounts.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                3. Use of the Platform
              </h2>
              <p className="text-muted-foreground mb-3">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Upload harmful, offensive, or illegal content</li>
                <li>Violate intellectual property rights</li>
                <li>Attempt to hack, reverse-engineer, or bypass security</li>
                <li>Spam users or misuse communication features</li>
                <li>
                  Upload pirated content or copyrighted material without
                  permission
                </li>
              </ul>
              <p className="text-white font-semibold mt-4">
                We reserve the right to remove content or suspend accounts that
                violate these rules.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                4. Content Ownership
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  You own the intellectual property rights for projects, posts,
                  files, and documents you upload.
                </li>
                <li>
                  By uploading, you grant Kluster a non-exclusive, royalty-free
                  license to display your content on the platform.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                5. Platform Features
              </h2>
              <p className="text-muted-foreground mb-3">Kluster provides:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Project collaboration tools</li>
                <li>Portfolio & profile management</li>
                <li>College community & networking feed</li>
                <li>Document storage</li>
                <li>Academic workflow utilities (as added later)</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Features may change, be added, or removed anytime.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                6. Limitation of Liability
              </h2>
              <p className="text-muted-foreground mb-3">Kluster:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  Is not responsible for inaccuracies or user-generated content
                </li>
                <li>
                  Is not liable for any academic, career, or financial outcomes
                </li>
                <li>Is provided "as-is" without warranties</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                7. Termination
              </h2>
              <p className="text-muted-foreground mb-3">
                We may suspend or terminate your access for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Policy violations</li>
                <li>Misuse of platform</li>
                <li>Legal or institutional requirements</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                You may delete your account anytime.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                8. Changes to Terms
              </h2>
              <p className="text-muted-foreground">
                We may update these Terms. Continued use of the platform means
                you accept changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                9. Contact
              </h2>
              <p className="text-muted-foreground">
                For questions:{" "}
                <a
                  href="mailto:official@kluster.in"
                  className="text-neon-cyan hover:underline"
                >
                  official@kluster.in
                </a>
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
