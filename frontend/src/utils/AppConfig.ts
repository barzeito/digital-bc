class AppConfig {
    public apiBaseUrl = 'http://localhost:8080';
    public cardsUrl = `${this.apiBaseUrl}/api/cards`;
    public usersUrl = `${this.apiBaseUrl}/api/users`;
    public socialUrl = `${this.apiBaseUrl}/api/social`;
    public signUpUrl = `${this.apiBaseUrl}/api/signup`;
    public signInUrl = `${this.apiBaseUrl}/api/signin`;
    public appointmentsUrl = `${this.apiBaseUrl}/api/apps`;
    public changePasswordUrl = `${this.apiBaseUrl}/api/change-password`;
    public forgotPasswordUrl = `${this.apiBaseUrl}/api/forgot-Password`;
    public resetPasswordUrl = `${this.apiBaseUrl}/api/reset-password`;
    public isAdminUrl = `${this.apiBaseUrl}/api/role`;
    public isPremiumUrl = `${this.apiBaseUrl}/api/premium`;
    public contactUrl = `${this.apiBaseUrl}/api/contact`;

}

const appConfig = new AppConfig();
export default appConfig;