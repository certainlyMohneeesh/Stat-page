declare module 'passport-github2' {
  import { Strategy as PassportStrategy } from 'passport';
  import { Request } from 'express';

  interface Profile {
    id: string;
    displayName: string;
    username: string;
    profileUrl: string;
    emails?: Array<{ value: string; type?: string }>;
    photos?: Array<{ value: string }>;
  }

  interface StrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string[];
  }

  interface StrategyOptionsWithRequest extends StrategyOptions {
    passReqToCallback: true;
  }

  type VerifyCallback = (error: any, user?: any, info?: any) => void;
  type VerifyFunction = (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ) => void;
  type VerifyFunctionWithRequest = (
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ) => void;

  class Strategy extends PassportStrategy {
    constructor(
      options: StrategyOptions,
      verify: VerifyFunction
    );
    constructor(
      options: StrategyOptionsWithRequest,
      verify: VerifyFunctionWithRequest
    );
  }

  export { Strategy };
} 