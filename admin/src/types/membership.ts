export interface Membership {
    id?: number;
    image?: File | null;
    imageUrl?: string;
    name: string;
    price: number;
    type: string;
    duration?: number;
    status: string;
    benefits: MembershipBenefit[];
}

export interface MembershipBenefit {
    type: string;
    description: string;
    benefitRefId: number;
    quantity: number;
}