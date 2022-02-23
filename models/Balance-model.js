export class Balance {
    constructor() {
        this.uniqMovements = [];
        this.duplicates = [];
    }
    set movements(movements) {
        for (const movement of movements) {
            this.isDuplicate(movement.id) ?
                this.duplicates.push(movement)
                : this.uniqMovements.push(movement);
        }
    }
    isDuplicate(id) {
        return this.uniqMovements.map(({ id }) => id).includes(id);
    }
    get movements() {
        return this.uniqMovements.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    get duplicatesMovements() {
        return this.duplicates.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    computeBalance(date) {
        if (date) {
            return this.uniqMovements.reduce((acc, curr) => {
                if (curr.date <= date)
                    acc = acc + curr.amount;
                return acc;
            }, 0);
        }
        return this.uniqMovements.reduce((acc, curr) => acc + curr.amount, 0);
    }
}
export class BalanceChecker {
    constructor() {
        this.discrepancies = [];
    }
    submit(balance, checkPoints) {
        for (const { date, amount } of checkPoints) {
            const discrepancy = amount - balance.computeBalance(date);
            this.discrepancies.push({
                date,
                id: balance.movements
                    .filter(movement => movement.date <= date)
                    .map(({ id }) => id),
                discrepancy
            });
        }
    }
    get discrepanciesPruned() {
        const validatedMovements = this.discrepancies.reduce((acc, curr) => {
            if (curr.discrepancy === 0)
                acc = acc.concat(curr.id);
            return acc;
        }, []);
        return this.discrepancies
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(({ date, discrepancy, id }) => {
            id = id.filter((value) => !validatedMovements.includes(value));
            return { date, id, discrepancy };
        });
    }
    isCorrectBalance() {
        return this.discrepancies.reduce((acc, curr) => acc + curr.discrepancy, 0) === 0;
    }
}
