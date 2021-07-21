import Swal from 'sweetalert2'

class SweetAlert {

    public static simpleMessage(msg: string) {
        return Swal.fire(msg)
    }

    public static simpleToastMsgError(msg: string) {
        return Swal.mixin({
            toast: true,
            position: "center",
            timer: 35000,
        }).fire({
            icon: "warning",
            title: msg
        })
    }


    public static simpleHtmlHolder() {
        return Swal.fire({
            title: '<strong>HTML <u>example</u></strong>',
            icon: 'info',
            html:
                'You can use <b>bold text</b>, ' +
                '<a href="//sweetalert2.github.io">links</a> ' +
                'and other HTML tags' + '<li></li>',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText:
                '<i class="fa fa-thumbs-up"></i> Great!',
            confirmButtonAriaLabel: 'Thumbs up, great!',
            cancelButtonText:
                '<i class="fa fa-thumbs-down"></i>',
            cancelButtonAriaLabel: 'Thumbs down'
        })
    }


    public static requirementErrorMessage(message: any) {
        return Swal.fire({
            title: 'Requirement error message',
            icon: 'info',
            html: message,
            // showCloseButton: true,
            // showCancelButton: true,
            focusConfirm: false,
            confirmButtonText:
                '<i class="fa fa-thumbs-up"></i> OK',
            // confirmButtonAriaLabel: 'Thumbs up, great!',
            // cancelButtonText:
            //     '<i class="fa fa-thumbs-down"></i>',
            // cancelButtonAriaLabel: 'Thumbs down'
        })
    }

    private static setTime(totalSeconds: number) {
        const time = ++totalSeconds
        SweetAlert.simpleToastMsgError(`will logout in: ${time}`)
        return time
    }

    public static timeoutWarning() {
        let totalSecond = 0;
        // const time = setInterval(SweetAlert.setTime, 1000)
        let timeSecond = 0;
        setInterval(() => {
            const timeAdded = SweetAlert.setTime(timeSecond)
            timeSecond = timeAdded
        }, 1000)
    }

}

export default SweetAlert