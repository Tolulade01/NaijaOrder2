const sections = [
  {
    title: 'What NaijaOrder is',
    body: 'NaijaOrder is a business management application for organizing customer, product and order information. This page explains the general privacy approach for the early-access version.'
  },
  {
    title: 'Information you provide',
    body: 'When you create an account or use the application, you may provide information needed to operate your account and manage your business records, such as customer, product and order information.'
  },
  {
    title: 'How information is used',
    body: 'Information is used to provide the NaijaOrder features you request, maintain your account, display your business records and improve the product experience.'
  },
  {
    title: 'Your responsibility',
    body: 'Only enter information that you have a legitimate reason to store and use. Do not use NaijaOrder to store passwords, payment-card numbers, authentication secrets or other highly sensitive information that the product does not specifically request.'
  },
  {
    title: 'Third-party services',
    body: 'NaijaOrder may rely on third-party infrastructure and services to provide hosting, authentication, database and application functionality. Their handling of information is governed by their own applicable policies and terms.'
  },
  {
    title: 'Changes to this policy',
    body: 'As NaijaOrder develops, this policy may be updated to reflect new features, services or legal requirements. Material changes will be reflected on this page.'
  }
];

export default function Page() {
  return (
    <main className="bg-[#fffaf0]">
      <section className="mx-auto max-w-4xl px-6 py-20 sm:py-24">
        <div className="border-b border-emerald-950/10 pb-10">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-700">Legal</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-emerald-950 sm:text-5xl">Privacy Policy</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
            We want you to understand what information you put into NaijaOrder and why it is needed to provide the service.
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
          This early-access policy is intended as product information and should be reviewed and updated with appropriate legal advice before a wider commercial launch.
        </p>
      </section>
    </main>
  );
}
