
"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import type { Campaign } from '@/lib/firebase/types';

interface CampaignContextType {
  campaign: Campaign | null;
  setCampaign: (campaign: Campaign | null) => void;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const CampaignProvider = ({ 
  children, 
  campaign, 
  setCampaign 
}: { 
  children: ReactNode, 
  campaign: Campaign | null, 
  setCampaign: (campaign: Campaign | null) => void 
}) => {
  return (
    <CampaignContext.Provider value={{ campaign, setCampaign }}>
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (context === undefined) {
    throw new Error('useCampaign must be used within a CampaignProvider');
  }
  return context;
};
