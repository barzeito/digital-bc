class AppConfig {
    public apiBaseUrl = 'http://localhost:8080';
    public cardsUrl = `${this.apiBaseUrl}/api/cards`;
    public socialUrl = `${this.apiBaseUrl}/api/social`;
    public signUpUrl = `${this.apiBaseUrl}/api/signup`;
    public signInUrl = `${this.apiBaseUrl}/api/signin`;
    public changePasswordUrl = `${this.apiBaseUrl}/api/change-password`;
    public isAdminUrl = `${this.apiBaseUrl}/api/role`;
    public successNotificationDuration = 2000;
    public errorNotificationDuration = 6000;
}

const appConfig = new AppConfig();
export default appConfig;