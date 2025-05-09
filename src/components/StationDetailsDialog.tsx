
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Star, MapPin, CloudLightning, Heart, CreditCard, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { db } from '@/firebase';
import { doc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

interface Station {
  id: number;
  name: string;
  address: string;
  distance: string;
  rating: number;
  reviews: number;
  available: number;
  total: number;
  type: string;
  price: string;
  latitude: number;
  longitude: number;
}

interface StationDetailsDialogProps {
  station: Station | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onReserve?: () => void;
}

const StationDetailsDialog = ({
  station,
  open,
  onOpenChange,
  isFavorite = false,
  onToggleFavorite,
  onReserve,
}: StationDetailsDialogProps) => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  if (!station) return null;

  const handleSubmitReview = async () => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to leave a review.",
        variant: "destructive"
      });
      return;
    }

    if (userRating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating.",
        variant: "destructive"
      });
      return;
    }

    setSubmittingReview(true);

    try {
      // In a real app, this would add the review to your database
      // Here we're just simulating it
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });

      setUserRating(0);
      setReviewText('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle className="text-xl font-bold">{station.name}</DialogTitle>
            {onToggleFavorite && (
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full h-8 w-8"
                onClick={onToggleFavorite}
              >
                {isFavorite ? (
                  <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                ) : (
                  <Heart className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
        </DialogHeader>

        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="pt-4">
            <div className="space-y-5 text-gray-700">
              {/* Address and Availability */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  {station.address}
                </div>
                <Badge variant={station.available > 0 ? "success" : "destructive"}>
                  {station.available > 0
                    ? `${station.available}/${station.total} Available`
                    : 'Full'}
                </Badge>
              </div>

              {/* Rating and Type */}
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  {station.rating} ({station.reviews} reviews)
                </div>
                <div className="flex items-center gap-2">
                  <CloudLightning className="h-4 w-4 text-evblue-500" />
                  {station.type}
                </div>
              </div>

              {/* Price */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-sm mb-1">Pricing</h4>
                <p className="text-sm text-gray-600">{station.price}</p>
              </div>

              {/* Distance */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-sm mb-1">Distance</h4>
                <p className="text-sm text-gray-600">{station.distance}</p>
              </div>

              {/* Directions */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-sm mb-2">Directions</h4>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-evblue-500 font-medium hover:underline"
                >
                  <img
                    src="https://stimg.cardekho.com/pwa/img/fuel-stations/locationNew.svg"
                    alt="Get Direction"
                    className="w-5 h-5"
                  />
                  Get Direction
                </a>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button 
                className="w-full"
                disabled={station.available === 0}
                onClick={onReserve}
              >
                {station.available > 0 ? 'Reserve Now' : 'Currently Full'}
              </Button>
            </DialogFooter>
          </TabsContent>
          
          <TabsContent value="reviews" className="pt-4">
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h4 className="font-semibold mb-2">Leave a Review</h4>
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      className="focus:outline-none"
                    >
                      <Star 
                        className={`h-6 w-6 ${
                          star <= userRating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                        }`} 
                      />
                    </button>
                  ))}
                </div>
                <Textarea
                  placeholder="Share your experience..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="resize-none"
                  rows={3}
                />
                <Button 
                  className="mt-2 w-full"
                  onClick={handleSubmitReview}
                  disabled={submittingReview}
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Recent Reviews</h4>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            className={`h-3 w-3 ${
                              star <= 4 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">2 weeks ago</span>
                    </div>
                    <p className="text-sm mt-1">
                      Great location! The chargers were fast and the staff was very helpful.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            className={`h-3 w-3 ${
                              star <= 5 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">1 month ago</span>
                    </div>
                    <p className="text-sm mt-1">
                      Best charging station I've used so far. Clean facilities and reliable chargers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="payment" className="pt-4">
            <div className="space-y-6">
              <div className="text-center border-b pb-6">
                <h4 className="font-semibold mb-1">Price</h4>
                <div className="text-2xl font-bold">{station.price}</div>
                <p className="text-sm text-gray-500 mt-1">Per charging session</p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Payment Methods</h4>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-blue-500 mr-2" />
                      <span>VISA •••• 4242</span>
                    </div>
                    <Badge variant="outline">Default</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-red-500 mr-2" />
                      <span>Mastercard •••• 5555</span>
                    </div>
                    <Button variant="ghost" size="sm">Use</Button>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button 
                className="w-full"
                disabled={station.available === 0}
                onClick={onReserve}
              >
                {station.available > 0 ? 'Pay & Reserve' : 'Currently Full'}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default StationDetailsDialog;
