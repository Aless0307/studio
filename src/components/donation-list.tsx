"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react'; // Import useEffect
import type { Donation } from '@/types/donation';
import DonationCard from './donation-card';
import { Skeleton } from './ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"; // Import Card components
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from 'lucide-react';

// --- Mock Data ---
const generateMockDonations = (count: number): Donation[] => {
  const items = ['Bread Loaves', 'Fresh Apples', 'Canned Soup', 'Milk Cartons', 'Pasta Boxes', 'Yogurt Cups'];
  const quantities = ['10 loaves', '5 kg', '2 cases', '20 cartons', '15 boxes', '50 cups'];
  const locations = ['Downtown Bakery', 'Northside Grocer', 'Central Warehouse', 'East End Cafe', 'West Market', 'South Superette'];
  const statuses: Donation['status'][] = ['available', 'available', 'available', 'claimed', 'delivered', 'expired'];
  const descriptions = [
    'Slightly past best-by but still good.',
    'Organic Gala apples.',
    'Tomato soup, minor dent on some cans.',
    'Whole milk, nearing expiration.',
    'Gluten-free penne.',
    'Strawberry flavor, good for 2 more days.',
  ];
   const photoHints = ['bread bakery', 'apples fruit', 'soup cans', 'milk carton', 'pasta box', 'yogurt cups']; // AI Hints for picsum

  return Array.from({ length: count }, (_, i) => {
    const status = statuses[i % statuses.length];
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + (i % 14) - 3); // Expiration +/- a week
    const postedDate = new Date();
    postedDate.setDate(postedDate.getDate() - (i % 5)); // Posted recently
    const claimedDate = status === 'claimed' || status === 'delivered' ? new Date(postedDate.getTime() + 86400000) : undefined; // Claimed 1 day after post
    const deliveredDate = status === 'delivered' ? new Date(claimedDate!.getTime() + 86400000 * 2) : undefined; // Delivered 2 days after claim

    return {
      id: `donation-${i + 1}`,
      itemName: items[i % items.length],
      description: descriptions[i % descriptions.length],
      quantity: quantities[i % quantities.length],
      expirationDate: baseDate.toISOString(),
      pickupLocation: locations[i % locations.length],
      photoUrl: `https://picsum.photos/seed/${i + 100}/400/300`, // Use seeded picsum for consistency
      postedBy: `Business ${String.fromCharCode(65 + (i % 5))}`, // Business A, B, C...
      status: status,
      claimedBy: status === 'claimed' || status === 'delivered' ? `Org ${i % 3 + 1}` : undefined,
      postedAt: postedDate.toISOString(),
      claimedAt: claimedDate?.toISOString(),
      deliveredAt: deliveredDate?.toISOString(),
      // Add ai-hint to donation data for the card to use
      'data-ai-hint': photoHints[i % photoHints.length],
    };
  });
};
// --- End Mock Data ---


interface DonationListProps {
   listType?: 'available' | 'claimed' | 'history'; // To filter or adjust display later
   role: 'business' | 'organization'; // To control actions like claiming
}

const DonationList: FC<DonationListProps> = ({ listType = 'available', role }) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Simulate fetching data
  useEffect(() => {
    setIsLoading(true);
    // In a real app, fetch from an API based on listType and role
    console.log(`Fetching donations for type: ${listType}, role: ${role}`);
    setTimeout(() => {
      const mockData = generateMockDonations(8); // Generate 8 mock donations
      // Filter based on type (simple example)
      let filteredData = mockData;
      if (listType === 'available') {
          filteredData = mockData.filter(d => d.status === 'available');
      } else if (listType === 'claimed') {
          // Example: show claimed but not yet delivered for an org
          filteredData = mockData.filter(d => d.status === 'claimed' /* && d.claimedBy === currentUserOrgId */);
      } else if (listType === 'history') {
           // Example: show delivered or expired
          filteredData = mockData.filter(d => d.status === 'delivered' || d.status === 'expired');
      }

      setDonations(filteredData);
      setIsLoading(false);
    }, 1500); // Simulate network delay
  }, [listType, role]); // Refetch if listType or role changes

  const handleClaim = (donationId: string) => {
    console.log(`Claiming donation ${donationId}`);
    // Simulate API call to claim
    // Update the local state optimistically or after API confirmation
    setDonations(prevDonations =>
      prevDonations.map(d =>
        d.id === donationId ? { ...d, status: 'claimed', claimedBy: 'Your Organization' } : d // Example update
      )
    );
     toast({
      title: "Donation Claimed!",
      description: `You have successfully claimed donation ID: ${donationId}.`,
    });
    // In a real app, you'd likely refetch or get updated data from the backend
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 md:p-6">
        {Array.from({ length: 6 }).map((_, index) => (
           <Card key={index} className="w-full overflow-hidden shadow-md">
             <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-1" />
             </CardHeader>
              <CardContent className="grid gap-3">
                 <Skeleton className="h-40 w-full rounded-md" />
                 <Skeleton className="h-4 w-5/6" />
                 <Skeleton className="h-4 w-3/4" />
                 <Skeleton className="h-4 w-4/5" />
                 <Skeleton className="h-3 w-1/3 mt-1" />
              </CardContent>
               <CardFooter>
                 <Skeleton className="h-10 w-full" />
               </CardFooter>
           </Card>
        ))}
      </div>
    );
  }

  if (donations.length === 0) {
     return (
        <div className="flex justify-center items-center min-h-[40vh] p-4 md:p-6">
             <Alert className="max-w-md text-center bg-secondary">
                <Info className="h-5 w-5" />
                <AlertTitle>No Donations Found</AlertTitle>
                <AlertDescription>
                    There are currently no donations matching your criteria. Check back later!
                 </AlertDescription>
            </Alert>
        </div>
     )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 md:p-6">
      {donations.map(donation => (
        <DonationCard
          key={donation.id}
          donation={{...donation, photoUrl: donation.photoUrl ? `${donation.photoUrl}?${donation['data-ai-hint']}` : undefined}} // Pass hint if using picsum
          onClaim={handleClaim}
          isClaimable={role === 'organization' && listType === 'available'} // Only orgs can claim available items
        />
      ))}
    </div>
  );
};

export default DonationList;
