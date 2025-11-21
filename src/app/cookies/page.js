import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Cookie Policy | Kluster",
  description: "Cookie Policy for Kluster - How we use cookies",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-cyber-dark cyber-bg py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="border-cyber-border bg-cyber-card/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-4xl bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
              Cookie Policy
            </CardTitle>
            <CardDescription>Last Updated: 17 Nov 2025</CardDescription>
          </CardHeader>

          <CardContent className="prose prose-invert max-w-none">
            <p className="text-lg">
              Kluster uses cookies to improve user experience.
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                1. What Are Cookies?
              </h2>
              <p className="text-muted-foreground">
                Small text files stored on your device when using Kluster.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                2. Types of Cookies We Use
              </h2>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">
                a. Essential Cookies
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Required for login</li>
                <li>Maintain sessions</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">
                b. Functional Cookies
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Save user preferences</li>
                <li>Keep dashboard settings</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">
                c. Analytics Cookies
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Help us understand usage</li>
                <li>Improve UI/UX</li>
              </ul>

              <p className="text-white font-semibold mt-6">
                We do not use advertising cookies at this stage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                3. Cookie Control
              </h2>
              <p className="text-muted-foreground">
                You can disable cookies in your browser settings, but some parts
                of Kluster may not function correctly.
              </p>
            </section>

            <Separator className="my-8 bg-cyber-border" />
            <section>
              <p className="text-muted-foreground">
                For questions or concerns, contact us at:{" "}
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
