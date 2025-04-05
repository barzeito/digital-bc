class AppConfig {
    public apiBaseUrl = 'http://localhost:8080';
    public signInUrl = `${this.apiBaseUrl}/api/signin`;
    public successNotificationDuration = 2000;
    public errorNotificationDuration = 6000;
}

const appConfig = new AppConfig();
export default appConfig;