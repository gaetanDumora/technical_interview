interface IBankingFormat {
    id: number,
    date: Date,
    wording: string,
    amount: number
}
export class Balance {
    private uniqMovements: Array<IBankingFormat> = []
    private duplicates: Array<IBankingFormat> = []
    set movements(movements: Array<IBankingFormat>) {
        for (const movement of movements) {
            this.isDuplicate(movement.id) ?
                this.duplicates.push(movement)
                : this.uniqMovements.push(movement)
        }
    }
    private isDuplicate(id: number): boolean {
        return this.uniqMovements.map(({ id }) => id).includes(id)
    }
    get movements(): IBankingFormat[] {
        return this.uniqMovements.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }
    get duplicatesMovements(): IBankingFormat[] {
        return this.duplicates.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }
    computeBalance(date?: Date): number {
        if (date) {
            return this.uniqMovements.reduce(
                (acc: number, curr: IBankingFormat) => {
                    if (curr.date <= date) acc = acc + curr.amount
                    return acc
                }, 0)
        }
        return this.uniqMovements.reduce(
            (acc: number, curr: IBankingFormat) =>
                acc + curr.amount, 0)
    }
}

interface ICorrectBalance {
    date: Date,
    amount: number
}
interface IDiscrepancy {
    date: Date,
    id: number[],
    discrepancy: number
}
export class BalanceChecker {
    private discrepancies: IDiscrepancy[] = []
    submit(balance: Balance, checkPoints: ICorrectBalance[]) {
        for (const { date, amount } of checkPoints) {
            const discrepancy = amount - balance.computeBalance(date)
            this.discrepancies.push({
                date,
                id: balance.movements
                    .filter(movement => movement.date <= date)
                    .map(({ id }) => id),
                discrepancy
            })
        }
    }
    get discrepanciesPruned() {
        const validatedMovements = this.discrepancies.reduce((acc, curr) => {
            if (curr.discrepancy === 0) acc = acc.concat(curr.id)
            return acc
        }, [] as Array<number>)
        return this.discrepancies
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(({ date, discrepancy, id }) => {
                    id = id.filter((value) => !validatedMovements.includes(value))
                return { date, id, discrepancy }
            })
    }
    isCorrectBalance(): boolean {
        return this.discrepancies.reduce(
            (acc: number, curr: IDiscrepancy) => acc + curr.discrepancy, 0) === 0
    }
}