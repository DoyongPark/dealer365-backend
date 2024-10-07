export interface UserContext {
    exp: number;
    iat: number;
    jti: string;
    iss: string;
    aud: string[];
    sub: string;
    typ: string;
    azp: string;
    sid: string;
    acr: string;
    'allowed-origins': string[];
    realm_access: Realmaccess;
    resource_access: Resourceaccess;
    scope: string;
    'all-tenants': Alltenant[];
    email_verified: boolean;
    name: string;
    'active-tenant': Alltenant;
    preferred_username: string;
    given_name: string;
    family_name: string;
    email: string;
  }
  interface Alltenant {
    tenant_id: string;
    tenant_name: string;
    roles: string[];
  }
  interface Resourceaccess {
    'dealer365-resource-server': Realmaccess;
    'dealer365-saas-admin-ui-console': Realmaccess;
    account: Realmaccess;
  }
  interface Realmaccess {
    roles: string[];
  }