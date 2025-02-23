'use client';

import {Layout} from '@/components/layout';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Switch} from '@/components/ui/switch';
import {useState} from 'react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Admin Dashboard',
    contactEmail: 'admin@example.com',
    enableNotifications: true,
    maintenanceMode: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value, type, checked} = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically send the settings to your backend
    console.log('Settings saved:', settings);
    // Show a success message to the user
    alert('Settings saved successfully!');
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div>
          <Label htmlFor="siteName">Site Name</Label>
          <Input id="siteName" name="siteName" value={settings.siteName} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="contactEmail">Contact Email</Label>
          <Input
            id="contactEmail"
            name="contactEmail"
            type="email"
            value={settings.contactEmail}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="enableNotifications"
            name="enableNotifications"
            checked={settings.enableNotifications}
            onCheckedChange={(checked) =>
              setSettings((prev) => ({...prev, enableNotifications: checked}))
            }
          />
          <Label htmlFor="enableNotifications">Enable Notifications</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="maintenanceMode"
            name="maintenanceMode"
            checked={settings.maintenanceMode}
            onCheckedChange={(checked) =>
              setSettings((prev) => ({...prev, maintenanceMode: checked}))
            }
          />
          <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
        </div>
        <Button type="submit">Save Settings</Button>
      </form>
    </Layout>
  );
}
