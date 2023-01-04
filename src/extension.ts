import * as vscode from 'vscode';
//import * as dotenv from 'dotenv';
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();


export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "github-copilot-clone" is now active!');

	let disposable = vscode.commands.registerCommand('github-copilot-clone.helloWorld', () => {

		vscode.window.showInformationMessage('Hello World from Github-Copilot-Clone!');
	});

	const provider = new MyInlineCompletionItemProvider();
	vscode.languages.registerInlineCompletionItemProvider({pattern: "**"}, provider);

	context.subscriptions.push(disposable);
}

export function deactivate() {}


export class MyInlineCompletionItemProvider implements vscode.InlineCompletionItemProvider {
  async provideInlineCompletionItems(document: vscode.TextDocument, position: vscode.Position){

	let textBefore = document.getText(new vscode.Range(new vscode.Position(0, 0), position));
	const textAfter = document.getText(new vscode.Range(position, new vscode.Position(Number.MAX_VALUE, Number.MAX_VALUE)));

// 	console.log(process.env.OPENAI_API_KEY);
// 	const l = textBefore.length;
// 	if(textBefore[l-1] !== '?'){
// 		return [];
// 	}

	//textBefore = textBefore.substring(0, l-1);
	//console.log(textBefore);

	let textSuggestions = [];
	try{

		const configuration = new Configuration({
		apiKey: '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', 		//put your own api key here. you can get it from openai website
		});
		const openai = new OpenAIApi(configuration);
	
		const response = await openai.createCompletion({
		model: "code-davinci-002",
		prompt: textBefore,
		suffix: textAfter,
		temperature: .7,
		max_tokens: 256,
		top_p: 1,
		frequency_penalty: 0,
		presence_penalty: 0,
		stop: null,
		n: 3,
		});
	
		const completion = response.data.choices;
		console.log(completion);
		for(let i=0; i<completion.length; i++){
			let val = new vscode.InlineCompletionItem(completion[i].text, new vscode.Range(position, position));
			val.insertText = completion[i].text;
			textSuggestions.push(val);
		}

		//console.log(textSuggestions);

	}
	catch(e){
		console.log(e);
		return [];
	}


    return textSuggestions;
  }
}


