import typer
from agent_runner import run_support_query

cli_app = typer.Typer()

@cli_app.command()
def chat():
    typer.echo("\U0001F4C1 AI Support Case Assistant (Type 'exit' to quit)\n")
    while True:
        message = typer.prompt("\U0001F4DD Enter your query")
        if message.lower() in ("exit", "quit"):
            typer.echo("\U0001F44B Exiting. Goodbye!")
            break

        result = run_support_query(message)
        typer.echo(f"\n\U0001F50D Similar Cases:\n{result}\n")