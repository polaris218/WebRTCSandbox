import {Component, Input} from '@angular/core';

@Component({
    selector: 'ui-slider',
    templateUrl: './ui-slider.component.html'
})

export class UiSliderComponent {
    private isDown: boolean = false;
    private cursor: any = {
        x: 0,
        y: 0
    };

    /**
     * Выставляем начальную позицию
     *
     * */
    smth() {}

    /**
     * Обрабатываем события мыши
     *
     * */
    onMouseMove($event) {
        if (!this.isDown) {
            return;
        }
    }

    onMouseDown($event) {
        this.setCursorPosition($event);

        this.isDown = true;
    }

    onMouseUp($event) {
        this.isDown = false;
    }

    /**
     * Вспомогательные функции
     *
     * */
    setCursorPosition($event) {
        this.cursor = {
            x: $event.clientX,
            y: $event.clientY
        };
    }

    getMouseMoveDirection($event) {
        return this.cursor.x > $event.clientX ? -1 : 1;
    }
}
