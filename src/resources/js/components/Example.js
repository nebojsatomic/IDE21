import React from 'react';
import ReactDOM from 'react-dom';

function Example() {
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">Example Component</div>

                        <div className="card-body">I'm an example component!</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Example;

if (document.getElementById('root')) {
    ReactDOM.render(<Example />, document.getElementById('root'));
}



/*
import React from 'react';

import Button from '@material-ui/core/Button';

function MyButton() {
  return (
    <MyButton color="primary" onClick="{ () => { alert('clicked') }}">
    Open page
    </MyButton>
    );
}
export default MyButton;


if (document.getElementById('root')) {
    ReactDOM.render(<MyButton />, document.getElementById('root'));
}
*/
