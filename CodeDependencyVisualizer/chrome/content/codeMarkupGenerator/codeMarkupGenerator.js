/**
 * Created by Jomaras.
 * Date: 27.03.12.@07:54
 */
FBL.ns(function () { with (FBL) {
    /*******/
    const astHelper = Firecrow.ASTHelper;
    const valueTypeHelper = Firecrow.ValueTypeHelper;

    Firecrow.CodeMarkupGenerator =
    {
        generateHtml: function(element)
        {
            try
            {
                if(astHelper.isProgram(element))
                {
                    var html = "<div class=\"jsContainer\">";

                    if(element.body != null)
                    {
                        for(var i = 0; i < element.body.length; i++)
                        {
                            //var previousElement = element.body[i-1];  unused variable
                            var currentElement = element.body[i];

                            html += this.generateHtml(currentElement);
                            html += this.generateEndLineHtml(currentElement);
                        }
                    }

                    html += "</div>";
                    return html;
                }

                /**
                 * generalized
                 */
                else if (astHelper.isStatement(element))             { return this.generateStatement(element); }
                else if (astHelper.isExpression(element))            { return this.generateExpression(element); }

                /**
                 * rest
                 */
                else if (astHelper.isSwitchCase(element))            { return this.generateFromSwitchCase(element); }
                else if (astHelper.isCatchClause(element))           { return this.generateFromCatchClause(element); }
                else if (astHelper.isFunction(element))              { return this.generateFromFunction(element, true); }
                else if (astHelper.isVariableDeclaration(element))   { return this.generateFromVariableDeclaration(element); }
                else if (astHelper.isVariableDeclarator(element))    { return this.generateFromVariableDeclarator(element); }
                else if (astHelper.isLiteral(element))               { return this.generateFromLiteral(element); }
                else if (astHelper.isIdentifier(element))            { return this.generateFromIdentifier(element); }
                else
                {
                    console.log(element);
                    alert("Error while generating HTML in codeMarkupGenerator: unidentified ast element."); return "";
                }
            }
            catch(e)
            {
                alert("Error while generating HTML in codeMarkupGenerator: " + e);
            }
        },

        generateStatement: function(statement)
        {
            try
            {
                var html = "";

                //html += this.generateStartLineHtml(statement);

                if (astHelper.isEmptyStatement(statement))  { html += this.generateFromEmptyStatement(statement); }
                else if (astHelper.isBlockStatement(statement)) { html += this.generateFromBlockStatement(statement); }
                else if (astHelper.isExpressionStatement(statement)) { html += this.generateFromExpressionStatement(statement); }
                else if (astHelper.isIfStatement(statement)) { html += this.generateFromIfStatement(statement); }
                else if (astHelper.isWhileStatement(statement)) { html += this.generateFromWhileStatement(statement); }
                else if (astHelper.isDoWhileStatement(statement)) { html += this.generateFromDoWhileStatement(statement); }
                else if (astHelper.isForStatement(statement)) { html += this.generateFromForStatement(statement); }
                else if (astHelper.isForInStatement(statement)) { html += this.generateFromForInStatement(statement); }
                else if (astHelper.isLabeledStatement(statement)) { html += this.generateFromLabeledStatement(statement); }
                else if (astHelper.isBreakStatement(statement)) { html+= this.generateFromBreakStatement(statement); }
                else if (astHelper.isContinueStatement(statement)) { html += this.generateFromContinueStatement(statement); }
                else if (astHelper.isReturnStatement(statement)) { html += this.generateFromReturnStatement(statement); }
                else if (astHelper.isWithStatement(statement)) { html += this.generateFromWithStatement(statement); }
                else if (astHelper.isTryStatement(statement)) { html += this.generateFromTryStatement(statement); }
                else if (astHelper.isThrowStatement(statement)) { html += this.generateFromThrowStatement(statement); }
                else if (astHelper.isSwitchStatement(statement)) { html += this.generateFromSwitchStatement(statement); }
                else { alert("Error: AST Statement element not defined: " + expression.type);  return "";}

                //html += this.generateEndLineHtml(statement);

                return html;
            }
            catch(e) { alert("Error when generating HTML from a statement: " + e); }
        },

        generateExpression: function(expression)
        {
            try
            {
                var html = "";

                if (astHelper.isAssignmentExpression(expression)) { html += this.generateFromAssignmentExpression(expression); }
                else if (astHelper.isUnaryExpression(expression)) { html += this.generateFromUnaryExpression(expression); }
                else if (astHelper.isBinaryExpression(expression)) { html += this.generateFromBinaryExpression(expression); }
                else if (astHelper.isLogicalExpression(expression)) { html += this.generateFromLogicalExpression(expression); }
                else if (astHelper.isLiteral(expression)) { html += this.generateFromLiteral(expression); }
                else if (astHelper.isIdentifier(expression)) { html += this.generateFromIdentifier(expression); }
                else if (astHelper.isUpdateExpression(expression)) { html += this.generateFromUpdateExpression(expression); }
                else if (astHelper.isNewExpression(expression)) { html += this.generateFromNewExpression(expression); }
                else if (astHelper.isConditionalExpression(expression)) { html += this.generateFromConditionalExpression(expression); }
                else if (astHelper.isThisExpression(expression)) { html += this.generateFromThisExpression(expression); }
                else if (astHelper.isCallExpression(expression)) { html += this.generateFromCallExpression(expression); }
                else if (astHelper.isMemberExpression(expression)) { html += this.generateFromMemberExpression(expression); }
                else if (astHelper.isSequenceExpression(expression)) { html += this.generateFromSequenceExpression(expression); }
                else if (astHelper.isArrayExpression(expression)) { html += this.generateFromArrayExpression(expression); }
                else if (astHelper.isObjectExpression(expression)) { html += this.generateFromObjectExpression(expression); }
                else if (astHelper.isFunctionExpression(expression)) { html += this.generateFromFunction(expression, true); }
                else { alert("Error: AST Expression element not defined: " + expression.type);  return "";}

                return html;
            }
            catch(e) { alert("Error when generating HTML from an expression:" + e); }
        },

        generateFromFunction: function(functionDecExp, hasFunctionKeyword)
        {
            try
            {
                if(!astHelper.isFunction(functionDecExp)) { alert("Invalid Element when generating function html code!"); }

                var html = this.getStartElementHtml("div", {class: functionDecExp.type + " Selectable", id : "astElement" + functionDecExp.astId });

                if (functionDecExp.type === "FunctionDeclaration")
                {
                    html += this.getElementHtml("span", {class: "keyword"}, "function") + " "
                          + this.generateFromIdentifier(functionDecExp.id);
                }
                else
                {
                    if(functionDecExp.id != null)
                        html += this.generateFromIdentifier(functionDecExp.id);

                    if(hasFunctionKeyword === true)
                        html += this.getElementHtml("span", {class: "keyword"}, "function");
                }

                html +=  this.generateFunctionParametersHtml(functionDecExp)
                      +  this.generateFromFunctionBody(functionDecExp)
                      + this.getEndElementHtml("div");

                return html;
            }
            catch(e) { alert("Error when generating HTML from a function:" + e); }
        },

//      Replaced by: generateFromFunction
//
//    generateFromFunctionDeclaration: function(functionDeclaration)
//    {
//        try
//        {
//            if(!astHelper.isFunctionDeclaration(functionDeclaration)) { alert("Invalid element when generating function declaration html code!"); return ""; }
//
//            var html = this.getStartElementHtml("div", {class: 'funcDecl', id : "astElement" + functionDeclaration.astId });
//
//            html += this.getElementHtml("span", {class:"keyword"}, "function") + " "
//                 +  this.generateFromIdentifier(functionDeclaration.id)
//                 +  this.generateFunctionParametersHtml(functionDeclaration)
//                 +  this.generateFromFunctionBody(functionDeclaration);
//
//            html += this.getEndElementHtml("div");
//
//            return html;
//        }
//        catch(e) { alert("Error when generating HTML form a function declaration:" + e); }
//    },

        generateFunctionParametersHtml: function(functionDecExp)
        {
            try
            {
                if(!astHelper.isFunction(functionDecExp)) { alert("Invalid element when generating function parameters html code!"); return ""; }

                var html = "(";

                for(var i = 0; i < functionDecExp.params.length; i++)
                {
                    if(i != 0) { html += ", "; }

                    html += this.generateFromPattern(functionDecExp.params[i]);
                }
                html += ")";

                return html;
            }
            catch(e) { alert("Error when generating HTML from function parameters:" + e);}
        },

        generateFromFunctionBody: function(functionDeclExp)
        {
            try
            {
                if(!astHelper.isFunction(functionDeclExp)) { alert("Invalid element when generating function body html code!"); return ""; }

                return this.generateHtml(functionDeclExp.body);
            }
            catch(e) { alert("Error when generating HTML from function body:" + e); }
        },

        generateFromBlockStatement: function(blockStatement)
        {
            try
            {
                if(!astHelper.isBlockStatement(blockStatement)) { alert("Invalid element when generating block statement html code!"); return ""; }

                var html = this.getStartElementHtml("div", { class: astHelper.CONST.STATEMENT.BlockStatement + " Selectable", id: "astElement" + blockStatement.astId});

                html += this.getElementHtml("div", {class: "Bracket"}, "{");

                //this.currentIntendation += "&nbsp;&nbsp;";

                blockStatement.body.forEach(function(statement)
                {
                    html += this.generateHtml(statement) + this.generateEndLineHtml(statement);
                }, this);

                //this.currentIntendation = this.currentIntendation.replace(/&nbsp;&nbsp;$/g, "");

                html += this.getElementHtml("div", {class: "Bracket"}, "}");
                html += this.getEndElementHtml("div");

                return html;
            }
            catch(e) { alert("Error when generating HTML from block statement:" + e);}
        },

        generateFromEmptyStatement: function(emptyStatement)
        {
            try
            {
                if(!astHelper.isEmptyStatement(emptyStatement)) { alert("Invalid element when generating empty statement html code!"); return ""; }

                return this.getElementHtml("div", {class: astHelper.CONST.STATEMENT.EmptyStatement + " Selectable", id: "astElement" + emptyStatement.astId}, ";");
            }
            catch(e) { alert("Error when generating HTML from empty statement:" + e); }
        },

        generateFromExpressionStatement: function(expressionStatement)
        {
            try
            {
                if(!astHelper.isExpressionStatement(expressionStatement)) { alert("Invalid element when generating expression statement html code!"); return "";}

                var html = "";

                html += this.getStartElementHtml("div", { class: astHelper.CONST.STATEMENT.ExpressionStatement + " Selectable", id: "astElement" + expressionStatement.astId});

                html += this.generateHtml(expressionStatement.expression);

                html += ";" + this.getEndElementHtml("div");

                return html;
            }
            catch(e) { alert("Error when generating HTML from expression statement:" + e); }
        },

        generateFromAssignmentExpression: function(assignmentExpression)
        {
            try
            {
                if(!astHelper.isAssignmentExpression(assignmentExpression)) { alert("Invalid element when generating assignment expression html code!"); return "";}

                return this.getStartElementHtml("span", { class: astHelper.CONST.EXPRESSION.AssignmentExpression + " Selectable", id: "astElement" + assignmentExpression.astId})
                    + this.generateHtml(assignmentExpression.left)
                    + " " + assignmentExpression.operator + " "
                    + this.generateHtml(assignmentExpression.right)
                    + this.getEndElementHtml("span");
            }
            catch(e) { alert("Error when generating HTML from assignment expression:" + e); }
        },

        generateFromUnaryExpression: function(unaryExpression)
        {
            try
            {
                if(!astHelper.isUnaryExpression(unaryExpression)) { alert("Invalid element when generating unary expression html code!"); return "";}

                var html = this.getStartElementHtml("span", {class: astHelper.CONST.EXPRESSION.UnaryExpression + " Selectable", id: "astElement" + unaryExpression.astId});

                if(unaryExpression.prefix) html += unaryExpression.operator;

                if(unaryExpression.operator == "typeof"
                    || unaryExpression.operator == "void"
                    || unaryExpression.operator == "delete") html += " (";

                html += this.generateExpression(unaryExpression.argument);

                if(!unaryExpression.prefix) html += unaryExpression.operator;

                if(unaryExpression.operator == "typeof"
                    || unaryExpression.operator == "void"
                    || unaryExpression.operator == "delete") html += ")";

                html += this.getEndElementHtml("span");

                return html;
            }
            catch(e) { alert("Error when generating HTML from unary expression:" + e); }
        },

        generateFromBinaryExpression: function(binaryExpression)
        {
            try
            {
                if(!astHelper.isBinaryExpression(binaryExpression)) { alert("Invalid element when generating binary expression html code!"); return ""; }

                var html = this.getStartElementHtml("span", { class: astHelper.CONST.EXPRESSION.BinaryExpression + " Selectable", id: "astElement" + binaryExpression.astId});

                html += this.generateHtml(binaryExpression.left);
                html += " " + binaryExpression.operator + " ";
                html += this.generateHtml(binaryExpression.right);

                html += this.getEndElementHtml("span");

                return html;
            }
            catch(e) { alert("Error when generating HTML from binary expression:" + e); }
        },

        generateFromLogicalExpression: function(logicalExpression)
        {
            try
            {
                if(!astHelper.isLogicalExpression(logicalExpression)) { alert("Invalid element when generating logical expression html code!"); return ""; }

                var html = this.getStartElementHtml("span", { class: astHelper.CONST.EXPRESSION.LogicalExpression + " Selectable", id: "astElement" + logicalExpression.astId});

                html += this.generateHtml(logicalExpression.left);
                html += " " + logicalExpression.operator + " ";
                html += this.generateHtml(logicalExpression.right);

                html += this.getEndElementHtml("span");

                return html;
            }
            catch(e) { alert("Error when generating HTML from logical expression:" + e); }
        },

        generateFromUpdateExpression: function(updateExpression)
        {
            try
            {
                if(!astHelper.isUpdateExpression(updateExpression)) { alert("Invalid element when generating update expression html code!"); return ""; }

                var html = this.getStartElementHtml("span", { class: astHelper.CONST.EXPRESSION.UpdateExpression + " Selectable", id: "astElement" + updateExpression.astId });

                // if prefixed e.g.: ++i
                if(updateExpression.prefix) html += updateExpression.operator;

                html += this.generateHtml(updateExpression.argument);

                // if postfixed e.g.: i++
                if(!updateExpression.prefix) html += updateExpression.operator;

                html += this.getEndElementHtml("span");

                return html;
            }
            catch(e) { alert("Error when generating HTML from update expression:" + e); }
        },

        generateFromNewExpression: function(newExpression)
        {
            try
            {
                var argumentNumber = 0;

                if(!astHelper.isNewExpression(newExpression)) { alert("Invalid element when generating new expression html code!"); return ""; }

                var html = this.getStartElementHtml("span", {class: astHelper.CONST.EXPRESSION.NewExpression + " Selectable", id: "astElement" + newExpression.astId})
                    + this.getElementHtml("span", {class: "keyword"}, "new") + " "
                    + this.generateHtml(newExpression.callee) + "("
                    + this.getSequenceHtml(newExpression.arguments)
                    + ")" + this.getEndElementHtml("span");

                return html;
            }
            catch(e) { alert("Error when generating HTML from new expression:" + e); }
        },

        generateFromConditionalExpression: function(conditionalExpression)
        {
            try
            {
                if(!astHelper.isConditionalExpression(conditionalExpression)) { alert("Invalid element when generating conditional expression html code!"); return ""; }

                var html;

                html = this.getStartElementHtml("span", {class: astHelper.CONST.EXPRESSION.ConditionalExpression + " Selectable", id: "astElement" + conditionalExpression.astId})
                    + this.generateHtml(conditionalExpression.test)
                    + " ? " + this.generateHtml(conditionalExpression.consequent)
                    + " : " + this.generateHtml(conditionalExpression.alternate)
                    + this.getEndElementHtml("span");

                return html;

            }
            catch(e) { alert("Error when generating HTML from conditional expression:" + e); }
        },

        generateFromThisExpression: function(thisExpression)
        {
            try
            {
                if(!astHelper.isThisExpression(thisExpression)) { alert("Invalid element when generating this expression html code!"); return ""; }

                return this.getElementHtml("span", { class: "keyword", id: "astElement"}, "this");
            }
            catch(e) { alert("Error when generating HTML from this expression:" + e); }
        },

        generateFromCallExpression: function(callExpression)
        {
            try
            {
                if(!astHelper.isCallExpression(callExpression)) { alert("Invalid element when generating call expression html code!"); return ""; }

                var html = this.generateHtml(callExpression.callee) + "(";

                html += this.getSequenceHtml(callExpression.arguments);

                html += ")";

                return html;
            }
            catch(e) { alert("Error when generating HTML from call expression:" + e); }
        },

        generateFromMemberExpression: function(memberExpression)
        {
            try
            {
                if(!astHelper.isMemberExpression(memberExpression)) { alert("Invalid element when generating member expression html code!"); return ""; }

                var html = this.getStartElementHtml("span", { class: astHelper.CONST.EXPRESSION.MemberExpression + " Selectable", id: "astElement" + memberExpression.astId})
                    + this.generateHtml(memberExpression.object);

                if(memberExpression.computed === false)
                {
                    html += "." + this.generateHtml(memberExpression.property);
                }
                else if(memberExpression.computed === true)
                {
                    html += "[" + this.generateHtml(memberExpression.property) + "]";
                }

                html += this.getEndElementHtml("span");

                return html;
            }
            catch(e) { alert("Error when generating HTML from member expression:" + e); }
        },

        generateFromSequenceExpression: function(sequenceExpression)
        {
            try
            {
                if(!astHelper.isSequenceExpression(sequenceExpression)) { alert("Invalid element when generating sequence expression html code!"); return ""; }

                var html = this.getStartElementHtml("span", { class: astHelper.CONST.EXPRESSION.SequenceExpression + " Selectable", id: "astElement" + sequenceExpression.astId});

                html += this.getSequenceHtml(sequenceExpression.expressions);

                html += this.getEndElementHtml("span");

                return html;
            }
            catch(e) { alert("Error when generating HTML from member expression:" + e); }
        },

        generateFromArrayExpression: function(arrayExpression)
        {
            try
            {
                if(!astHelper.isArrayExpression(arrayExpression)) { alert("Invalid element when generating array expression html code!"); return ""; }

                var html = this.getStartElementHtml("span", {class: astHelper.CONST.EXPRESSION.ArrayExpression + " Selectable", id: "astElement" + arrayExpression.astId});
                html += "[" + this.getSequenceHtml(arrayExpression.elements) + "]";
                html += this.getEndElementHtml("span");

                return html;
            }
            catch(e) { alert("Error when generating HTML from array expression:" + e); }
        },

        generateFromObjectExpression: function(objectExpression)
        {
            try
            {
                if(!astHelper.isObjectExpression(objectExpression)) { alert("Invalid element when generating object expression html code!"); return ""; }

                var html = this.getStartElementHtml("div", {class: astHelper.CONST.EXPRESSION.ObjectExpression + " Selectable", id: "astElement" + objectExpression.astId});

                html += "{";
                // if objectExpression kind is "init" and has no properties, e.g.: object = {}
                if(objectExpression.properties.length == 0) /* do nothing */ ;
                // if objectExpression kind is "init" and has properties, e.g.: object = {x: 1, y: 2}
                else if(objectExpression.properties[0].kind == "init")
                {
                    html += "<br>";
                    for(var i = 0; i < objectExpression.properties.length; i++)
                    {
                        if(i != 0) html += ",<br>";

                        html += this.generateHtml(objectExpression.properties[i].key) + ": "
                            + this.generateHtml(objectExpression.properties[i].value);
                    }
                    html += "<br>";
                }

                /** if objectExpression kind is "get" or "set", e.g.:
                 get value()
                 {
                 return this._value}
                 ,set value(val)
                 {
                 this._value = val}
                 */
                else
                {
                    for(var i = 0; i < objectExpression.properties.length; i++)
                    {
                        if(i != 0) html += ", ";
                        html += "<br>";

                        if(objectExpression.properties[i].kind == "get" || objectExpression.properties[i].kind == "set")
                        {
                            html += this.getElementHtml("span", {class: "keyword"}, objectExpression.properties[i].kind)
                                + " " + this.generateHtml(objectExpression.properties[i].key);

                            if (astHelper.isFunctionExpression(objectExpression.properties[i].value))
                                html += this.generateFromFunction(objectExpression.properties[i].value, false);
                            else
                                html += this.generateExpression(objectExpression.properties[i].value);
                        }
                    }


                }

                html += "}" + this.getEndElementHtml("div");

                return html;
            }
            catch(e) { alert("Error when generating HTML from object expression:" + e); }
        },

        generateFromIfStatement: function(ifStatement)
        {
            try
            {
                if(!astHelper.isIfStatement(ifStatement)) { alert("Invalid element when generating empty statement html code!"); return ""; }

                var html = this.getStartElementHtml("div", {class: astHelper.CONST.STATEMENT.IfStatement + " Selectable", id:"astElement" + ifStatement.astId})
                         + this.getElementHtml("span", {class:"keyword"}, "if")
                         + " (" + this.generateHtml(ifStatement.test) + ") ";

                if(!astHelper.isBlockStatement(ifStatement.consequent))
                    html += "<br>";

                html += this.generateHtml(ifStatement.consequent)
                      + this.generateEndLineHtml(ifStatement.consequent);

                if(ifStatement.alternate != null)
                {
                    html += this.getElementHtml("span", {class:"keyword"}, "else ")
                         + this.generateHtml(ifStatement.alternate)
                         + this.generateEndLineHtml(ifStatement.alternate);
                }

                html += this.getEndElementHtml("div");

                return html;
            }
            catch(e) { alert("Error when generating HTML from if statement:" + e); }
        },

        generateFromWhileStatement: function(whileStatement)
        {
            try
            {
                if(!astHelper.isWhileStatement(whileStatement)) { alert("Invalid element when generating while statement html code!"); return ""; }

                var html = this.getStartElementHtml("div", {class: astHelper.CONST.STATEMENT.WhileStatement + " Selectable", id: "astElement" + whileStatement.astId})
                    + this.getElementHtml("span", {class:"keyword"}, "while")
                    + "(" + this.generateHtml(whileStatement.test) + ")  ";

                //if(!astHelper.isBlockStatement(whileStatement.consequent))
                //   html += "<br>";

                html += this.generateHtml(whileStatement.body)
                      + this.generateEndLineHtml(whileStatement.consequent)
                      + this.getEndElementHtml("div");

                return html;
            }
            catch(e) { alert("Error when generating HTML from while statement:" + e); }
        },

        generateFromDoWhileStatement: function(doWhileStatement)
        {
            try
            {
                if(!astHelper.isDoWhileStatement(doWhileStatement)) { alert("Invalid element when generating do while statement html code!"); return ""; }

                var html = this.getStartElementHtml("div", {class: astHelper.CONST.STATEMENT.DoWhileStatement + " Selectable", id: "astElement" + doWhileStatement.astId})
                         + this.getElementHtml("span", {class:"keyword"}, "do");

                if(!astHelper.isBlockStatement(doWhileStatement.body))
                    html += "<br>";

                html += this.generateHtml(doWhileStatement.body);

//                if(!astHelper.isBlockStatement(doWhileStatement.body))
//                    html += ";<br>";

                html += this.getElementHtml("span", {class:"keyword"}, "while")
                      + " (" + this.generateHtml(doWhileStatement.test) + ")"
                      + this.getEndElementHtml("div");

                return html;
            }
            catch(e) { alert("Error when generating HTML from do while statement:" + e); }
        },

        generateFromForStatement: function(forStatement)
        {
            try
            {
                if(!astHelper.isForStatement(forStatement)) { alert("Invalid element when generating for statement html code!"); return ""; }

                var html = this.getStartElementHtml("div", {class: astHelper.CONST.STATEMENT.ForStatement + " Selectable", id:"astElement" + forStatement.astId});

                html += this.getElementHtml("span", {class:"keyword"}, "for") + " "
                    + "(" + this.generateHtml(forStatement.init) + "; "
                    + this.generateHtml(forStatement.test) + "; "
                    + this.generateHtml(forStatement.update) + ") "
                    + this.generateHtml(forStatement.body);

                html += this.getEndElementHtml("div");

                return html;
            }
            catch(e) { alert("Error when generating HTML from for statement:" + e); }

//            try
//            {
//                if(!astHelper.isForStatement(forStatement)) { alert("Invalid element when generating for statement html code!"); return ""; }
//
//                var html = this.getStartElementHtml("div", {class: astHelper.CONST.STATEMENT.ForStatement, id:"astElement" + forStatement.astId});
//
//                html += this.getElementHtml("span", {class:"keyword"}, "for") + " "
//                      + "(" + this.generateHtml(forStatement.init) + "; "
//                      + this.generateHtml(forStatement.test) + "; "
//                      + this.generateHtml(forStatement.update) + ")";
//
//                html += this.generateHtml(forStatement.body);
//
//                if(!astHelper.isBlockStatement(forStatement.body))
//                    html += "<br>";
//
//                if(!astHelper.isBlockStatement(forStatement.body))
//                    html += ";<br>";
//
//                html += this.getEndElementHtml("div");
//
//                return html;
//            }
//            catch(e) { alert("Error when generating HTML from for statement:" + e); }
        },

        generateFromForInStatement: function(forInStatement)
        {
            try
            {
                if(!astHelper.isForInStatement(forInStatement)) { alert("Invalid element when generating for...in statement html code!"); return ""; }

                var html = this.getStartElementHtml("div", {class: astHelper.CONST.STATEMENT.ForInStatement + " Selectable", id:"astElement" + forInStatement.astId});

                html += this.getElementHtml("span", {class:"keyword"}, "for") + " ";

                if(forInStatement.each === true) html += this.getElementHtml("span", {class:"keyword"}, "each") + " ";

                html += "(" + this.generateHtml(forInStatement.left)
                    + " in " + this.generateExpression(forInStatement.right) + ")";

                if(!astHelper.isBlockStatement(forInStatement.body))
                    html += "<br>";

                html += this.generateStatement(forInStatement.body);

//                if(!astHelper.isBlockStatement(forInStatement.body))
//                    html += ";<br>";

                html += this.getEndElementHtml("div");

                return html;
            }
            catch(e) { alert("Error when generating HTML from for...in statement:" + e); }
        },

        generateFromBreakStatement: function(breakStatement)
        {
            try
            {
                if(!astHelper.isBreakStatement(breakStatement)) { alert("Invalid element when generating break statement html code!"); return ""; }

                var html = this.getStartElementHtml("span", {class: astHelper.CONST.STATEMENT.BreakStatement + " Selectable", id: "astElement" + breakStatement.astId})
                    + this.getElementHtml("span", {class:"keyword"}, "break");

                if(breakStatement.label != null) html += " " + this.generateFromIdentifier(breakStatement.label);

                html += this.getEndElementHtml("span");

                return html;
            }
            catch(e) { alert("Error when generating HTML from break statement:" + e); }
        },

        generateFromContinueStatement: function(continueStatement)
        {
            try
            {
                if(!astHelper.isContinueStatement(continueStatement)) { alert("Invalid element when generating continue statement html code!"); return ""; }

                var html = this.getStartElementHtml("span", {class: astHelper.CONST.STATEMENT.ContinueStatement + " Selectable", id: "astElement" + continueStatement.astId})
                    + this.getElementHtml("span", {class:"keyword"}, "continue");

                if(continueStatement.label != null) html += " " + this.generateFromIdentifier(continueStatement.label);

                html += this.getEndElementHtml("span");

                return html;
            }
            catch(e) { alert("Error when generating HTML from continue statement:" + e); }
        },

        generateFromReturnStatement: function(returnStatement)
        {
            try
            {
                if(!astHelper.isReturnStatement(returnStatement)) { alert("Invalid element when generating return statement html code!"); return ""; }

                var html = this.getStartElementHtml("div", {class: astHelper.CONST.STATEMENT.ReturnStatement + " Selectable", id: "astElement" + returnStatement.astId})
                    + this.getElementHtml("span", {class:"keyword"}, "return");

                if(returnStatement.argument != null) html += " " + this.generateExpression(returnStatement.argument);

                html += ";" + this.getEndElementHtml("div");

                return html;
            }
            catch(e) { alert("Error when generating HTML from return statement:" + e); }
        },

        generateFromWithStatement: function(withStatement)
        {
            try
            {
                if(!astHelper.isWithStatement(withStatement)) { alert("Invalid element when generating with statement html code!"); return ""; }

                var html = this.getStartElementHtml("div", {class: astHelper.CONST.STATEMENT.WithStatement + " Selectable", id: "astElement" + withStatement.astId})
                         + this.getElementHtml("span", {class:"keyword"}, "with") + " ("
                         + this.generateExpression(withStatement.object) + ")"
                         + this.generateStatement(withStatement.body)
                         + this.getEndElementHtml("div");

                return html;
            }
            catch(e) { alert("Error when generating HTML from with statement:" + e); }
        },

        generateFromThrowStatement: function(throwStatement)
        {
            try
            {
                if(!astHelper.isThrowStatement(throwStatement)) { alert("Invalid element when generating throw statement html code!"); return ""; }

                var html = this.getStartElementHtml("span", {class: astHelper.CONST.STATEMENT.ThrowStatement + " Selectable", id: "astElement" + throwStatement.astId})
                         + this.getElementHtml("span", {class: "keyword"}, "throw")
                         + " " + this.generateExpression(throwStatement.argument)
                         + this.getEndElementHtml("span");

                return html;
            }
            catch(e) { alert("Error when generating HTML from throw statement:" + e); }
        },

        generateFromSwitchStatement: function(switchStatement)
        {
            try
            {
                if(!astHelper.isSwitchStatement(switchStatement)) { alert("Invalid element when generating switch statement html code!"); return ""; }

                var html = this.getStartElementHtml("div", {class: astHelper.CONST.STATEMENT.SwitchStatement + " Selectable", id: "astElement" + switchStatement.astId})
                         + this.getElementHtml("span", {class: "keyword"}, "switch")
                         + " (" + this.generateExpression(switchStatement.discriminant) + ")"
                         + "<br>";

                html += this.getElementHtml("div", {class: "Bracket"}, "{");

                for(var i = 0; i < switchStatement.cases.length; i++)
                {
                    html += this.generateFromSwitchCase(switchStatement.cases[i]);
                }

                html += this.getElementHtml("div", {class: "Bracket"}, "{");

                html += this.getEndElementHtml("div");

                return html;
            }
            catch(e) { alert("Error when generating HTML from switch statement:" + e); }
        },

        generateFromSwitchCase: function(switchCase)
        {
            try
            {
                if(!astHelper.isSwitchCase(switchCase)) { alert("Invalid element when generating switch case html code!"); return ""; }

                var html = this.getStartElementHtml("div", {class: astHelper.CONST.SwitchCase + " Selectable", id: "astElement" + switchCase.astId})
                    + " ";

                if(switchCase.test === null) html += "default:<br>";
                else html += "case " + this.generateExpression(switchCase.test) + ":<br>";

                for(var i = 0; i < switchCase.consequent.length; i++)
                {
                    html += this.generateStatement(switchCase.consequent[i]) + this.generateEndLineHtml(switchCase.consequent[i]);
                }

                html += this.getEndElementHtml("div");

                return html;
            }
            catch(e) { alert("Error when generating HTML from switch case:" + e); }
        },

        generateFromTryStatement: function(tryStatement)
        {
            try
            {
                if(!astHelper.isTryStatement(tryStatement)) { alert("Invalid element when generating try statement html code!"); return ""; }

                var html = this.getStartElementHtml("div", {class: astHelper.CONST.STATEMENT.TryStatement  + " Selectable", id: "astElement" + tryStatement.astId})
                    + this.getElementHtml("span", {class:"keyword"}, "try")
                    + this.generateHtml(tryStatement.block);

                // catch clauses
                for(var i = 0; i < tryStatement.handlers.length; i++)
                {
                    html += this.generateFromCatchClause(tryStatement.handlers[i]);
                }

                if(tryStatement.finalizer != null)
                {
                    html += this.getElementHtml("span", {class:"keyword"}, "finally")
                        + this.generateHtml(tryStatement.finalizer);
                }

                html += this.getEndElementHtml("div");

                return html;
            }
            catch(e) { alert("Error when generating HTML from try statement:" + e); }
        },

        generateFromLabeledStatement: function(labeledStatement)
        {
            try
            {
                if(!astHelper.isLabeledStatement(labeledStatement)) { alert("Invalid element when generating labeled statement html code!"); return ""; }

                var html = this.getStartElementHtml("div", {class: astHelper.CONST.STATEMENT.LabeledStatement + " Selectable", id: "astElement" + labeledStatement.astId})
                    + this.generateFromIdentifier(labeledStatement.label) + ": "
                    + this.generateHtml(labeledStatement.body)
                    + this.getEndElementHtml("div");

                return html;
            }
            catch(e) { alert("Error when generating HTML from labeled statement:" + e); }
        },

        generateFromVariableDeclaration: function(variableDeclaration)
        {
            try
            {
                if(!astHelper.isVariableDeclaration(variableDeclaration)) { alert("Invalid element when generating html variable declaration"); return "";}

                var html = "";

                html += this.getStartElementHtml("span", {class: astHelper.CONST.VariableDeclaration + " Selectable", id : "astElement" + variableDeclaration.astId });
                html += this.getElementHtml("span", {class:"keyword"}, variableDeclaration.kind);
                html += " ";

                for(var i = 0; i < variableDeclaration.declarations.length; i++)
                {
                    var previousDeclarator = i == 0 ? variableDeclaration : variableDeclaration.declarations[i-1];
                    var currentDeclarator = variableDeclaration.declarations[i];

                    if(previousDeclarator.loc.start.line != currentDeclarator.loc.start.line)
                    {
                        //html += "<br/>";
                    }

                    if(previousDeclarator != variableDeclaration)
                    {
                        html += ", ";
                    }

                    html += this.generateFromVariableDeclarator(currentDeclarator);
                }

                html += ";" + this.getEndElementHtml("span") + "<br>";

                return html;
            }
            catch(e) { alert("Error when generating HTML from variable declaration:" + e);}
        },

        generateFromVariableDeclarator: function(variableDeclarator)
        {
            try
            {
                if(!astHelper.isVariableDeclarator(variableDeclarator)) { alert("The element is not a variable declarator when generating html code!"); return ""; }

                var html = this.generateFromPattern(variableDeclarator.id);

                if(variableDeclarator.init != null)
                {
                    html += " = ";
                    html += this.generateHtml(variableDeclarator.init);
                }

                return html;
            }
            catch(e) { alert("Error when generating HTML code from variableDeclarator - CodeMarkupGenerator:" + e);}
        },

        generateFromPattern: function(pattern)
        {
            try
            {
                //NOT FINISHED: there are other patterns!
                if(!astHelper.isIdentifier(pattern)) { alert("The pattern is not an identifier when generating html."); return "";}

                if(astHelper.isIdentifier(pattern)) { return this.generateFromIdentifier(pattern);}
            }
            catch(e) { alert("Error when generating HTML from pattern:" + e);}
        },

        generateFromCatchClause: function(catchClause)
        {
            try
            {
                if(!astHelper.isCatchClause(catchClause)) { alert("Invalid element when generating catch clause html code!"); return ""; }

                var html = this.getStartElementHtml("div", {class: astHelper.CONST.CatchClause + " Selectable", id: "astElement" + catchClause.astId})
                    + this.getElementHtml("span", {class: "keyword"}, "catch");

                html += " (" + this.generateHtml(catchClause.param);

                if(catchClause.guard != null) html += " if " + this.generateExpression(catchClause.guard);

                html += ")";
                html += this.generateStatement(catchClause.body);

                html += this.getEndElementHtml("div");

                return html;
            }
            catch(e) { alert("Error when generating HTML from catch clause:" + e);}
        },

        generateFromIdentifier: function(identifier)
        {
            try
            {
                if(!astHelper.isIdentifier(identifier)) { alert("The identifier is not valid when generating html."); return "";}

                return this.getElementHtml("span", {class: astHelper.CONST.Identifier + " Selectable", id: "astElement" + identifier.astId}, identifier.name);
            }
            catch(e) { alert("Error when generating HTML from an identifier:" + e);}
        },

        generateFromExpression: function(expression)
        {
            try
            {
                if(!astHelper.isLiteral(expression)) { alert("Currently when generating html from expressions we only support literals!"); return; }

                if(astHelper.isLiteral(expression))
                {
                    return this.getElementHtml("span", {class: astHelper.CONST.Literal, id: "astElement" + expression.astId}, expression.value);
                }
                if(astHelper.isIdentifier(expression))
                {
                    return this.getElementHtml("span", {class: astHelper.CONST.Identifier, id: "astElement" + expression.astId}, expression.name);
                }
                if(astHelper.isUpdateExpression(expression))
                {
                    var html = "";


                    return html;
                }
            }
            catch(e) { alert("Error when generating HTML from expression:" + e);}
        },

        generateFromLiteral: function(literal)
        {
            try
            {
                if (!astHelper.isLiteral(literal)) { alert("The literal is not valid when generating html."); return ""; }

                if (valueTypeHelper.isString(literal.value))
                    return this.getElementHtml("span", {class: "string", id: "astElement" + literal.astId}, "\"" + escapeHtml(literal.value) + "\"");
                else if (valueTypeHelper.isBoolean(literal.value) || valueTypeHelper.isNull(literal.value))
                    return this.getElementHtml("span", {class: "keyword", id: "astElement" + literal.astId}, literal.value);
                else if(valueTypeHelper.isInteger(literal.value))
                    return this.getElementHtml("span", {class: "number", id: "astElement" + literal.astId}, literal.value);
                else if(valueTypeHelper.isRegExp(literal.value))
                {
                    alert("RegExp!!");
                    return this.getElementHtml("span", {class: "regExp", id: "astElement" + literal.astId}, literal.value);
                }
                else
                    return this.getElementHtml("span", {class: astHelper.CONST.Literal, id: "astElement" + literal.astId}, literal.value);
            }
            catch(e) { alert("Error when generating HTML from literal:" + e);}
        },

        getSequenceHtml: function(sequence)
        {
            var html = "";

            for(var i = 0; i < sequence.length; i++)
            {
                if(i != 0) { html += ", "; }
                html += this.generateHtml(sequence[i]);
            }

            return html;
        },

        getElementHtml: function(elementType, attributes, content)
        {
            return this.getStartElementHtml(elementType, attributes) + content + this.getEndElementHtml(elementType);
        },

        getHtmlContent: function(content)
        {
            return this.currentIntendation + content;
        },

        getStartElementHtml: function(elementType, attributes)
        {
            try
            {
                var html = "<" + elementType + " ";

                for(var propertyName in attributes)
                {
                    html += propertyName + " = '" + attributes[propertyName] + "' ";
                }

                html += ">";

                return html;
            }
            catch(e) { alert("Error when generating start element html: " + e);}
        },

        getEndElementHtml: function(elementType)
        {
            try
            {
                return "</" + elementType  + ">";
            }
            catch(e) { alert("Error when generating end element html: " + e); }
        },

        generateStartLineHtml: function(currentElement)
        {
            try
            {
                return " ";
            }
            catch(e) { alert("Error when generating start line element formatting html: " + e); }
        },

        generateEndLineHtml: function(currentElement)
        {
            try
            {
                var html = "";

                if(astHelper.isForStatement(currentElement)
                || astHelper.isForInStatement(currentElement)
                || astHelper.isIfStatement(currentElement)
                || astHelper.isWhileStatement(currentElement)
                || astHelper.isDoWhileStatement(currentElement)
                || astHelper.isTryStatement(currentElement)
                || astHelper.isSwitchStatement(currentElement)
                || astHelper.isFunction(currentElement)
                || astHelper.isLabeledStatement(currentElement)
                || astHelper.isWithStatement(currentElement)
                || astHelper.isBlockStatement(currentElement)
                || astHelper.isEmptyStatement(currentElement)
                || astHelper.isReturnStatement(currentElement)
                || astHelper.isExpressionStatement(currentElement)
                || astHelper.isVariableDeclaration(currentElement))
                {
                    html = "";
                }
                else
                {
                     html =";<br>";
                }

                return html;
            }
            catch(e) { alert("Error when generating end line element formatting html: " + e); }
        },

        generateCodeContainer: function(content)
        {
            try
            {
                var html = "";

                html += this.getElementHtml("div", {class: "lineContainer"}, this.lineNumber++);
                html += this.getElementHtml("div", {class: "codeContainer"}, content);

                return html;
            }
            catch(e) { alert("Error when generating code container: " + e)}
        },

        /************************************************
         *  Function for generating HTML representation *
         ************************************************/
        generateHtmlRepresentation: function(root)
        {
            try
            {
                var html = "";

                // generate the HTML Document Type
                html += "<div class=\"documentType\">" + this.generateHtmlDocumentTypeTags(root.docType) + "</div>";

                // generate the <html></html> tags and everything in between
                html += "<div>" + this.generateHtmlOpeningTags(root.htmlElement.type, root.htmlElement.attributes);

                // generate <head>
                html += "<div class=\"head\">" + this.generateHtmlOpeningTags(root.htmlElement.children[0].type, root.htmlElement.children[0].attributes);

                // generate <head> children
                for (var i = 0; i < root.htmlElement.children[0].children.length; i++)
                {
                    html += "<div>" + this.generateHtmlElement(root.htmlElement.children[0].children[i]) + "</div>";
                }
                // generate </head>
                html +=this.generateHtmlClosingTags(root.htmlElement.children[0].type) + "</div>";

                // generate <body>
                html += "<div>" + this.generateHtmlOpeningTags(root.htmlElement.children[2].type, root.htmlElement.children[2].attributes);

                // generate <body> children
                for (var i = 0; i < root.htmlElement.children[2].children.length; i++)
                {
                    html += "<div>" + this.generateHtmlElement(root.htmlElement.children[2].children[i]) + "</div>";
                }
                // generate </body>
                html +=this.generateHtmlClosingTags(root.htmlElement.children[2].type) + "</div>";

                // generate </html>
                html += this.generateHtmlClosingTags(root.htmlElement.type) + "</div>";

                return html;
            }
            catch(e)
            {
                alert("Error while creating a HTML representation of the site: " + e);
            }
        },
        generateHtmlDocumentTypeTags: function(docType)
        {
            console.log(docType);

            if (docType == "")
            {
                return this.generateHtmlOpeningTags("&#33;DOCTYPE html", []);
            }
            else if (docType === "http://www.w3.org/TR/html4/strict.dtd")
            {
                return this.generateHtmlOpeningTags('&#33;DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"', []);
            }
            else if (docType === "http://www.w3.org/TR/html4/loose.dtd")
            {
                return this.generateHtmlOpeningTags('&#33;DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"', []);
            }
            else if (docType === "http://www.w3.org/TR/html4/frameset.dtd")
            {
                return this.generateHtmlOpeningTags('&#33;DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd"', []);
            }
            else if (docType === "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd")
            {
                return this.generateHtmlOpeningTags('&#33;DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"', []);
            }
            else if (docType === "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd")
            {
                return this.generateHtmlOpeningTags('&#33;DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"', []);
            }
            else if (docType === "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd")
            {
                return this.generateHtmlOpeningTags('&#33;DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd"', []);
            }
            else if (docType === "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd")
            {
                return this.generateHtmlOpeningTags('&#33;DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"', []);
            }
            else
            {
                return this.generateHtmlOpeningTags("&#33;DOCTYPE html " + docType + " -- NOT YET FINISHED", []);
            }
        },
        generateHtmlOpeningTags: function (elementType, elementAttributes)
        {
            if(elementType === "textNode")
                return "";

            var html = "";

            // generate <elementType attribute[0].name="attribute[0].value" ... attribute[N].name="attribute[N].value">
            // <elementType
            html += "&#60;" + elementType;
            for (var i = 0; i < elementAttributes.length; i++)
            {
                html += " " + elementAttributes[i].name + "=\"" + elementAttributes[i].value + "\"";
            }
            // >
            html += "&#62;";

            return html;
        },
        generateHtmlClosingTags: function (elementType)
        {
            if(elementType === "textNode")
                return "";

            var html = "";
            html += "&#60;&#47;" + elementType + "&#62;";
            return html;
        },
        generateHtmlElement: function(element)
        {
            try
            {
                var html = "";

                html += "<div class=\"" + element.type +"\">" + this.generateHtmlOpeningTags(element.type, element.attributes);

                if (element.type === "script")
                {
                    html += "<br>" + FBL.Firecrow.CodeMarkupGenerator.generateHtml(element.pathAndModel.model);
                }
                else if (element.type === "style")
                {
                    html += "<br>" + FBL.Firecrow.CodeMarkupGenerator.generateCSSRepresentation(element.pathAndModel.model);
                }
                else
                {
                    if(element.textContent != undefined)
                        html += element.textContent;

                    for(var i=0; i < element.children.length; i++)
                        html += this.generateHtmlElement(element.children[i]);

                }

                if (this.doesElementHaveClosingTags(element.type))
                    html += this.generateHtmlClosingTags(element.type);
                html += "</div>";

                return html;
            }
            catch(e) { alert("Error while generating a html element: " + e); }
        },
        generateCSSRepresentation: function(cssModel)
        {
            try
            {
                var html = "<div class=\"cssContainer\">";
                var cssRules = "";
                var rulesArray = [];
                for(var i = 0; i < cssModel.rules.length; i++)
                {
                    cssRules = cssModel.rules[i].cssText.replace(cssModel.rules[i].selector, "");

                    cssRules = cssRules.replace("{", "");
                    cssRules = cssRules.replace("}", "");
                    while(cssRules[0] === " ")
                        cssRules = cssRules.replace(" ", "");

                    html += cssModel.rules[i].selector + "<br>";
                    html += "{ <br>";

                    rulesArray = cssRules.split("; ");

                    for(var j = 0; j < rulesArray.length; j++)
                    {
                        if(rulesArray[j] != "")
                            html += "<span class=\"cssRule\">" + rulesArray[j] + ";</span><br>";
                    }
                    html += "} <br>";
                }

                html += "</div>";
                return html;
            }
            catch(e) { alert("Error while generating HTML representation of CSS: " + e); }
        },
        doesElementHaveClosingTags: function(elementType)
        {
          return !(elementType === "area"
              || elementType === "base"
              || elementType === "br"
              || elementType === "basefont"
              || elementType === "col"
              || elementType === "frame"
              || elementType ===  "hr"
              || elementType === "img"
              || elementType === "input"
              || elementType === "meta"
              || elementType === "link"
              //|| elementType === "script"
              || elementType === "param");
        }
    }
}});