type NotificationType = 'success' | 'error' | 'info' | 'warning';

class Notify {
    private container: HTMLElement;

    constructor() {
        this.container = document.createElement("div");
        this.container.className = "notify-container";
        document.body.appendChild(this.container);
    }

    public show(message: string, type: NotificationType = 'info', duration: number = 10000) {
        const notification = document.createElement("div");
        notification.className = `notify notify-${type}`;
        notification.innerHTML = `
            <span class="notify-message">${message}</span>
            <button class="notify-close">&times;</button>
        `;

        const closeBtn = notification.querySelector(".notify-close") as HTMLElement;
        closeBtn.onclick = () => this.container.removeChild(notification);

        this.container.appendChild(notification);

        setTimeout(() => {
            if (this.container.contains(notification)) {
                this.container.removeChild(notification);
            }
        }, duration);
    }

    public success(message: string | Error, duration?: number) {
        const msg = this.extractMessage(message);
        this.show(msg, 'success', duration);
    }

    public error(message: string | Error, duration?: number) {
        const msg = this.extractMessage(message);
        this.show(msg, 'error', duration);
    }

    public info(message: string | Error, duration?: number) {
        const msg = this.extractMessage(message);
        this.show(msg, 'info', duration);
    }

    public warning(message: string | Error, duration?: number) {
        const msg = this.extractMessage(message);
        this.show(msg, 'warning', duration);
    }

    private extractMessage(err: unknown): string {
        if (err instanceof Error) {
            return err.message;  
        } else if (typeof err === 'string') {
            return err;  
        }
        return 'An unknown error occurred';
    }
}

const notify = new Notify();
export default notify;
