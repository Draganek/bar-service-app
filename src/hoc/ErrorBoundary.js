import { Component } from "react";

class ErrorBoundary extends Component {
    state = {
        hasError: false
    };

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="alert alert-danger">
                    <h1> Wystąpił błąd: {this.state.error.message}</h1>
                </div>
            )
        }
        return this.props.children
    }
}

export default ErrorBoundary;
