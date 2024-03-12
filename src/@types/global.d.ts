declare const API_BASE_URL: string;
declare const EVENT_CALENDAR_URL: string;
declare const APP_BASE_URL: string;

interface EventInterface {
    eventID: number;
    name: string;
    location: string;
    type: string;
    date: string;
    image: string | null;
    ticketMinPrice: number | null;
    ticketMaxPrice: number | null;
    ticketSaleUrl: string | null;
    isPublic: boolean;
    status: EventStatus;
    activeFrom: string | null;
    activeTo: string | null;
    created_at: string;
    updated_at?: string;
    organizationID: number;
    showEventOnCalendar: boolean;
    redirectCustomText?: string | null;
    redirectCustomButtonText?: string | null;
}

type EventStatus = 'active' | 'inactive' | 'scheduled' | 'redirect'

interface EventWithSaleAmountInterface extends EventInterface {
    ticketsForSale: number;
}

interface TicketInterface {
    isSelling: boolean;
    ticketID: number;
    userID: number;
    eventID: number;
    header: string;
    description: string;
    price: number | null;
    quantity: number;
    requiresMembership: boolean;
    association?: string;
    created_at: string;
    updated_at?: string;
}

interface UserInterface {
    userID: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    city: string;
    created_at: string;
    updated_at?: string;
    passwordCode?: string;
    profilePicture?: any;
    ticketAlerts ? : Array<any>;
    userType: 'user' | 'admin' | 'superadmin';
    organizationID?: number;
}

interface ChatInterface {
    chatID: number;
    buyerID: number;
    sellerID: number;
    ticketID: number;
    timeCreated: string;
    lastMessage: string;
    isActive: boolean;
}

interface MessageInterface {
    chatID: number;
    senderID: number;
    receiverID: number;
    content: string;
    isRead: boolean;
    created_at: string;
    updated_at?: string;
}

interface GroupedLocation {
    label: string;
    options: { value: string; label: string }[];
}

interface GroupedOption {
    label: string;
    value: string;
}

interface ReportInterface {
    description: string;
    reporterID: number;
    reportedID: number;
}

interface ContactsWithEventsInterface {
    contact: any;
    event: EventInterface;
}

interface OrganizationInterface {
    organizationID: number;
    name: string;
    location: string | null;
    members: UserInterface[];
    license: string;
    created_at: string;
    updated_at?: string;
}

interface AdvertisementInterface {
    advertisementID: number;
    advertiser: string;
    contentHtml: string;
    isActive: boolean;
    views: number;
    clicks: number;
    redirectUrl: string;
    type: 'local' | 'global' | 'toast',
    location: string | null;
    created_at: string;
    updated_at?: string;
}

interface FileInterface {
    fileID: number;
    fileName: string;
    filePath: string;
    created_at: string;
    updated_at?: string;
}