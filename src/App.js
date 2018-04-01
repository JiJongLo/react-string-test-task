import React, {Component} from "react";
import './app.css';
import Button from 'material-ui/Button';

export default class Greeting extends Component {
    constructor(props) {
       super(props);
       this.state = {
           strings: this.newStrings(),
           previousState: []
       };
       this.loadCurrentState = this.loadCurrentState.bind(this);
       this.downLoadCurrentState = this.downLoadCurrentState.bind(this);
    }
    newStrings = () => {
        function randomElement (array) {
            return array[Math.floor(Math.random() * array.length)]
        }
        function generateString() {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            let result = '';
            const length = Math.floor(Math.random() * (991) + 100);
            for (let i = 0; i < length; i++) {
                result += randomElement(characters)
            }
            return result
        }
        const strings = [];
        const length = Math.floor(Math.random() * 9 + 2);
        for (let i = 0; i < length; i++) {
            strings.push(generateString())
        }
        return strings
    }

    normalizeStrings = () => {
        const isVowel = (c) => {
            return ['a', 'e', 'i', 'o', 'u'].includes(c.toLowerCase())
        }
        const arrayMove = (arr, old_index, new_index) => {
            if (new_index >= arr.length) {
                let k = new_index - arr.length + 1;
                while (k--) {
                    arr.push(undefined);
                }
            }
            arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
            return arr;
        }
        const normalize = (str) => {
            function isDifferentType (a, b){
                return  ((isVowel(a) && !isVowel(b)) ||  (isVowel(b) && !isVowel(a)))
            }
            function hasRestNegativeType (letter, array){
                return !!array.find(rec => {
                    return isVowel(letter) ? !isVowel(rec) : isVowel(rec)
                })
            }
            const letters = str.split('');
            for (let i = 0; i < letters.length; i++) {
                if (!i && isVowel(letters[i])) {
                    arrayMove(letters, i, letters.length - 1);
                    i--;
                    continue
                }
                if(letters[i+1] && !isDifferentType(letters[i], letters[i+1]) && hasRestNegativeType(letters[i+1], letters.slice(i + 2))) {
                    arrayMove(letters, i+1, letters.length -1);
                    i--;
                }
            }
            return letters.join('');

        };
        const iteratorStrings = (strings) => {
            const mutatedStrings = [...strings];
            function moveVowels(str, newStr) {
                const strLetters = str.split('');
                const newStrLetters = newStr.split('');
                let foundConsonant = false;
                for (let i = strLetters.length - 1; i > 0; i--) {
                    if (isVowel(strLetters[i]) && !foundConsonant) {
                        newStrLetters.unshift(strLetters[i]);
                        strLetters.pop();
                    } else {
                        foundConsonant = true
                    }
                }
                return [strLetters.join(''), newStrLetters.join('')]
            }
            for (let i = 0; i < mutatedStrings.length; i++) {
                if (i === mutatedStrings.length - 1) {
                    mutatedStrings[i] = normalize(mutatedStrings[i])
                } else {
                    const str = moveVowels(normalize(mutatedStrings[i]), mutatedStrings[i+1]);
                    mutatedStrings[i] = str[0];
                    mutatedStrings[i+1] = str[1];
                }
            }
            return mutatedStrings
        };
        const normalizedStrings = iteratorStrings(this.state.strings);
        this.setState((state) => ({
                strings: normalizedStrings,
                previousState: state.strings
            })
        )
    }
    returnPreviousState = () => {
        this.setState((state) => ({
                strings: state.previousState,
                previousState: []
            })
        )
    }
    generateRandomState = () => {
        this.setState(() => ({
                strings: this.newStrings(),
                previousState: []
            })
        )
    }

    async loadCurrentState() {
      await fetch("http://localhost:5000/api/string", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body:  JSON.stringify(this.state.strings)
        })
    }

    async downLoadCurrentState() {
        const res = await fetch("http://localhost:5000/api/string");
        const strings = await res.json();
        this.setState(() => ({ strings }))
    }

    render() {
        return <div className="grid">
            <div className="toolbar">
                <Button variant="raised" color="primary" onClick={this.normalizeStrings}>
                    Normalize strings
                </Button>

                <Button variant="raised" color="secondary" onClick={this.returnPreviousState}>
                    Come back to initial state
                </Button>
                <Button variant="raised" onClick={this.generateRandomState}>
                    Generate new state
                </Button>
                <Button variant="raised" onClick={this.loadCurrentState}>
                    Save current state
                </Button>
                <Button variant="raised" onClick={this.downLoadCurrentState}>
                    Load saved state
                </Button>
            </div>
            <div className="body">
                {this.state.strings.map(((str, key) => (<div key={key}>{str}</div>)))}
            </div>
        </div>;
    }
}