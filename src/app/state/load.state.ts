type TState = 'load' | 'loaded' | 'error';

export class LoadState {
    public readonly LOAD = 'load';
    public readonly LOADED = 'loaded';
    public readonly ERROR = 'error';

    private state: TState;

    load() {
        this.onLoad();
        return {
            next: () => this.onNext(),
            error: () => this.onError(),
            complete: () => {
            }
        };
    }

    get() {
        return this.state;
    }

    isLoaded() {
        return this.state === this.LOADED;
    }

    isLoad() {
        return this.state === this.LOAD;
    }

    protected onLoad() {
        this.state = this.LOAD;
    }

    protected onNext() {
        this.state = this.LOADED;
    }

    protected onError() {
        this.state = this.ERROR;
    }
}