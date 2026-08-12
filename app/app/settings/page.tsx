import { getBusiness } from '@/lib/supabase/data';
import { saveSettings } from '../actions';
import type { Business, Profile } from '@/types';

const businessFields: Array<{ name: keyof Pick<Business, 'name' | 'category' | 'phone' | 'whatsapp_number' | 'email' | 'address' | 'state' | 'city' | 'logo_url'>; label: string }> = [
  { name: 'name', label: 'Name' },
  { name: 'category', label: 'Category' },
  { name: 'phone', label: 'Phone' },
  { name: 'whatsapp_number', label: 'WhatsApp number' },
  { name: 'email', label: 'Email' },
  { name: 'address', label: 'Address' },
  { name: 'state', label: 'State' },
  { name: 'city', label: 'City' },
  { name: 'logo_url', label: 'Logo URL' },
];

export default async function Page() {
  const { supabase, business, user } = await getBusiness();
  const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', user.id).single<Profile>();

  return (
    <form action={saveSettings} className="card space-y-3 p-4">
      <h1 className="text-3xl font-black">Settings</h1>
      <h2 className="font-bold">Business settings</h2>
      {businessFields.map((field) => (
        <label className="label" key={field.name}>
          {field.label}
          <input className="input" name={field.name} defaultValue={business[field.name] ?? ''} />
        </label>
      ))}
      <h2 className="font-bold">Account settings</h2>
      <label className="label">
        Full name
        <input className="input" name="full_name" defaultValue={profile?.full_name ?? ''} />
      </label>
      <p>Email: {user.email}</p>
      <button className="btn btn-primary">Save settings</button>
    </form>
  );
}
