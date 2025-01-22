/**
 * A class to hold information about a minterm when using the Quine-McCluskey Algorithm
 */
//module.exports = class Minterm { //<- original code
class Minterm { //<- new code
    /**
     * Creates a new minterm object
     */
    constructor(values, value) {
        this.values = values;
        this.value = value;
        this.used = false;
		this.values.sort(function(number1, number2) {return number1 - number2;}); //<- new code
        //this.values.sort(function(number1, number2) {return number1 > number2;}); //<- original code
    }

    /**
     * Returns a String representation of the Minterm
     */
    toString() {
        let values = this.values.join(", ");
        return `m(${values}) = ${this.value}`;
    }

    /**
     * Determines if this Minterm object is equal to another object
     */
    equals(minterm) {

        if (!(minterm instanceof Minterm)) {
            return false;
        }

        return (
            this.value == minterm.value &&
            this.values.length == minterm.values.length &&
            this.values.every(function(u,i) {return u === minterm.values[i]})
        );
    }

    /**
     * Returns the values in this Minterm
     */
    getValues() {
        return this.values;
    }

    /**
     * Returns the binary value of this Minterm
     */
    getValue() {
        return this.value;
    }

    /**
     * Returns whether or not this Minterm has been used
     */
    isUsed() {
        return this.used;
    }

    /**
     * Labels this Minterm as "used"
     */
    use() {
        this.used = true;
    }
    
    /**
     * Combines 2 Minterms together if they can be combined
     */
    combine(minterm) {
        
        // Check if this value is this same; If so, do nothing
        if (this.value == minterm.value) {
            return null;
        }
        
        // Check if the values are the same; If so, do nothing
        if (this.values.length == minterm.values.length &&
            this.values.every(function(u,i) {return u === minterm.values[i]})) {
            return null;
        }
        
        // Keep track of the difference between the minterms
        let diff = 0;
        let result = "";

        // Iterate through the bits in this Minterm's value
        for (const i in this.value) {

            // Check if the current bit value differs from the minterm's bit value
            if (this.value.charAt(i) != minterm.value.charAt(i)) {
                diff += 1;
                result += "-";
            }

            // There is no difference
            else {
                result += this.value.charAt(i);
            }

            // The difference has exceeded 1
            if (diff > 1) {
                return null;
            }
        }

        return new Minterm(this.values.concat(minterm.values), result);
    }
}
