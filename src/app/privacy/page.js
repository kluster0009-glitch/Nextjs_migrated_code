export const metadata = {
  title: 'Privacy Policy | Kluster',
  description: 'Privacy Policy for Kluster - Your privacy is important to us',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-cyber-dark cyber-bg py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-cyber-card/50 backdrop-blur-xl rounded-lg border border-cyber-border p-8 md:p-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mb-8">Last Updated: 17 Nov 2025</p>
          
          <div className="prose prose-invert max-w-none space-y-6 text-foreground">
            <p className="text-lg">
              Your privacy is important to us. This Privacy Policy explains what data Kluster collects, why, and how we protect it.
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">a. Personal Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Name</li>
                <li>Students Email ID</li>
                <li>Department</li>
                <li>Roll number (hidden from public)</li>
                <li>Profile details (skills, resume, bio)</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">b. Usage Data</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Login activity</li>
                <li>Pages visited</li>
                <li>Device metadata</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">c. Uploaded Content</h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Projects</li>
                <li>Documents</li>
                <li>Comments & posts</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-3">We use your data to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Provide access to Kluster services</li>
                <li>Improve platform performance</li>
                <li>Show relevant projects & collaborations</li>
                <li>Ensure platform security</li>
                <li>Communicate important updates</li>
              </ul>
              <p className="text-white font-semibold mt-4">We do not sell your data.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Data Sharing</h2>
              <p className="text-muted-foreground mb-3">We share data only with:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Third-party tools for hosting & analytics</li>
                <li>Your college/institution if required for academic reasons</li>
                <li>Law enforcement only when legally required</li>
              </ul>
              <p className="text-white font-semibold mt-4">We never share or sell user data to advertisers.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Data Storage & Security</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Your data is stored on secure, encrypted servers.</li>
                <li>Only authorized personnel can access backend systems.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Your Rights</h2>
              <p className="text-muted-foreground mb-3">You can:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Access your data</li>
                <li>Edit or update profile information</li>
                <li>Request deletion of your account</li>
                <li>Request copies of your stored data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Cookies & Tracking</h2>
              <p className="text-muted-foreground mb-3">We use cookies for:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Login sessions</li>
                <li>Remembering preferences</li>
                <li>Analytics</li>
              </ul>
              <p className="text-muted-foreground mt-3">
                (See <a href="/cookies" className="text-neon-cyan hover:underline">Cookie Policy</a>)
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Children's Privacy</h2>
              <p className="text-muted-foreground">We do not knowingly collect data from users under 13.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Changes to Policy</h2>
              <p className="text-muted-foreground">We may update this policy from time to time.</p>
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
