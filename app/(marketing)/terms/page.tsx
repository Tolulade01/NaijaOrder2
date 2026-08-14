const sections = [
  {
    title: 'Using NaijaOrder',
    body: 'NaijaOrder is provided as a business organization tool. You are responsible for the accuracy of the information you enter and for using the service in accordance with applicable laws and regulations.'
  },
  {
    title: 'Your account',
    body: 'You are responsible for keeping your account credentials secure and for activity carried out through your account. Do not share authentication credentials with people who should not have access to your business records.'
  },
  {
    title: 'Your business data',
    body: 'You retain responsibility for the customer, product and order information you enter into NaijaOrder. Make sure you have the appropriate rights and permissions to collect and use information about your customers.'
  },
  {
    title: 'Early-access service',
    body: 'NaijaOrder V1 is an early-access product and features may change, be improved, become temporarily unavailable or be discontinued as development continues.'
  },
  {
    title: 'Acceptable use',
    body: 'Do not use NaijaOrder to abuse the service, attempt unauthorized access, interfere with its operation, upload malicious content or use the application for unlawful activity.'
  },
  {
    title: 'Pricing',
    body: 'NaijaOrder is currently free during early access and subscription billing is not implemented in V1. If paid plans are introduced, applicable pricing and terms will be communicated before they take effect.'
  },
  {
    title: 'Changes',
    body: 'These terms may be updated as NaijaOrder develops. Continued use of the service after updated terms are published may be subject to the revised terms.'
  }
];

export default function Page() {
  return (
    <main className="bg-[#fffaf0]">
      <section className="mx-auto max-w-4xl px-6 py-20 sm:py-24">
        <div className="border-b border-emerald-950/10 pb-10">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">Legal</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-emerald-950 sm:text-5xl">Terms of Use</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
            These terms describe the basic rules for using the early-access version of NaijaOrder.
          </p>
        </div>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.title} className="rounded-3xl border border-emerald-950/10 bg-white p-7 sm:p-8">
              <h2 className="text-xl font-black text-emerald-950">{section.title}</h2>
              <p className="mt-3 leading-8 text-slate-600">{section.body}</p>
            </section>
          ))}
        </div>

        <p className="mt-10 text-sm leading-6 text-slate-500">
          These early-access terms are product information and should be reviewed and updated with appropriate legal advice before a wider commercial launch.
        </p>
      </section>
    </main>
  );
}
