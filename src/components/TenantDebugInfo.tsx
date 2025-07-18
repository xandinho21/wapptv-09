
import React from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { Card } from '@/components/ui/card';

export const TenantDebugInfo = () => {
  const { currentTenant, loading, error } = useTenant();
  
  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 p-4 bg-gray-800 text-white text-xs max-w-sm z-50">
      <div className="font-bold mb-2">Debug Info</div>
      <div>Domain: {window.location.hostname}</div>
      <div>Loading: {loading ? 'Yes' : 'No'}</div>
      {error && <div className="text-red-400">Error: {error}</div>}
      {currentTenant ? (
        <div>
          <div>Tenant: {currentTenant.name}</div>
          <div>ID: {currentTenant.id}</div>
          <div>Domain: {currentTenant.domain}</div>
        </div>
      ) : (
        <div className="text-yellow-400">No tenant found</div>
      )}
    </Card>
  );
};
