class Numbers {
    public static format_En_UK(value: number) {
        return new Intl.NumberFormat('en-UK').format(value)
    }

    public static unFormat_En_UK_toNumber(formattedValue:string){
        const search = ',';
        const replaceWith = '';
        const result = formattedValue.split(search).join(replaceWith);

        return Number(result);
    }

}

export default Numbers