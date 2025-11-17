export const metadata = {
  title: 'Cookie Policy | Kluster',
  description: 'Cookie Policy for Kluster - How we use cookies',
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-cyber-dark cyber-bg py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-cyber-card/50 backdrop-blur-xl rounded-lg border border-cyber-border p-8 md:p-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent mb-4">
            Cookie Policy
          </h1>
          <p className="text-muted-foreground mb-8">Last Updated: 17 Nov 2025</p>
          
          <div className="prose prose-invert max-w-none space-y-6 text-foreground">
            <p className="text-lg">
              Kluster uses cookies to improve user experience.
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. What Are Cookies?</h2>
              <p className="text-muted-foreground">
                Small text files stored on your device when using Kluster.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">a. Essential Cookies</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Required for login</li>
                <li>Maintain sessions</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">b. Functional Cookies</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Save user preferences</li>
                <li>Keep dashboard settings</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">c. Analytics Cookies</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Help us understand usage</li>
                <li>Improve UI/UX</li>
              </ul>

              <p className="text-white font-semibold mt-6">
                We do not use advertising cookies at this stage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Cookie Control</h2>
              <p className="text-muted-foreground">
                You can disable cookies in your browser settings, but some parts of Kluster may not function correctly.
              </p>
            </section>

            <section className="mt-12 pt-8 border-t border-cyber-border">
              <p className="text-muted-foreground">
                For questions or concerns, contact us at:{' '}
                <a href="mailto:kluster0009@gmail.com" className="text-neon-cyan hover:underline">
                  kluster0009@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
