import { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import ReducerContext from '../../context/reducerContext'

export default function StafRoute(props) {
    const context = useContext(ReducerContext)

    return context.state.user && Number(context.state.user.perm) >= props.perm
    ? <Route {...props} />
    : <Redirect to="/" />
}
