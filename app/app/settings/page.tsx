import { getBusiness } from '@/lib/supabase/data';
import { saveSettings } from '../actions';
import { FormSubmitButton } from '@/components/FormSubmitButton';
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

export default async function Page({ searchParams }: { searchParams?: Promise<{ error?: string; success?: string }> }) {
  const { supabase, business, user } = await getBusiness();
  const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', user.id).single<Profile>();
  const params = searchParams ? await searchParams : {};
  const error = params.error ? decodeURIComponent(params.error) : '';
  const success = params.success ? decodeURIComponent(params.success) : '';

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700" role="status">
          ✓ {success}
        </div>
      )}

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
        <FormSubmitButton pendingLabel="Saving Settings...">Save Settings</FormSubmitButton>
      </form>
    </div>
  );
}
