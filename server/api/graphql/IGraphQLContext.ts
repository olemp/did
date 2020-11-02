import { MSGraphService, AzStorageService, SubscriptionService } from '../../services'

export interface IGraphQLContext {
    services: {
        msgraph: MSGraphService;
        azstorage: AzStorageService;
        subscription: SubscriptionService;
    }
    user: any;
    subscription: any;
}