import "./UserInfo.css";

import {Card} from "primereact/card";
import {Divider} from "primereact/divider";
import {Panel} from "primereact/panel";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import { Calendar } from 'primereact/calendar';
import {InputText} from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import { validate } from 'email-validator';

import {useState} from "react";
import {UserService} from "../../UserService";
import StringUtil from "../../../../utils/StringUtil";

function UserInfo({user, userId, setUser, stringUtil}) {
    const [form, setForm] = useState({
        firstname: user.firstName,
        lastname: user.lastName,
        email: user.email
    });

    const [emailValid, setEmailValid] = useState(true);
    const [firstnameValid, setFirstnameValid] = useState(true);
    const [lastnameValid, setLastnameValid] = useState(true);



    const [loading, setLoading] = useState(false);
    const userService = new UserService();

    const [displayBasic, setDisplayBasic] = useState(false);
    const dialogFuncMap = {'displayBasic': setDisplayBasic};

    const onClick = (name) => { dialogFuncMap[`${name}`](true); }
    const onHide = (name) => { dialogFuncMap[`${name}`](false); }

    function cardFooter() {
        return (
            <div className="actions">
                <Button label="Modifier" icon="pi pi-pencil" iconPos="right" onClick={() => onClick('displayBasic')} />
            </div>
        );
    }

    const handleChange = (event) => {
        const name = event.target.name;
        let value  = event.target.value;

        if(name === "email") setEmailValid(validate(value));
        if(name === "firstname") {
            setFirstnameValid(value !== "");
            form.firstname = value;
        }
        if(name === "lastname") {
            setLastnameValid(value !== "");
            form.lastname = value;
        }
        if(name === "email") {
            form.email = value;
        }

        console.log('form');
        console.log(form);
    }

    const handleSubmit = (event) => {
        setLoading(true);
        event.preventDefault();

        user.firstName = form.firstname !== "" ? form.firstname : user.firstName;
        user.lastName = form.lastname !== "" ? form.lastname : user.lastName;
        user.email = form.email !== "" ? form.email : user.email;

        userService.modifyUser(user).then(() => {
            userService.getUser(userId).then(data => {
                setUser(data);
            });
        });
    }

    return <div className="user-contents">
        <Card title="Vos informations personnelles" footer={cardFooter} subTitle="Vous pouvez sur cette page modifier l'ensemble des données vous concernant" style={{ height: '100%' }}>
            <Divider/>

            <Panel header="Informations basiques">
                <p className="user-info-row"><span>Prénom : </span>{StringUtil.checkValue(user.firstName, stringUtil.capitalize(user.firstName))}     </p>
                <Divider />

                <p><span>Nom de famille : </span>{StringUtil.checkValue(user.lastName, user.lastName.toUpperCase())}</p>

{/*                <p><span>Date de naissance : </span>{birthdate(user.birthdate)}</p>
                <Divider />

                <p><span>Genre :  </span>{genre(user.genre)}</p>*/}
            </Panel>

            <Panel header="Informations de contact">
                <p><span>Adresse mail :  </span>{StringUtil.checkValue(user.email, user.email)}</p>
{/*
                <p><span>Numéro de téléphone :  </span> {user.phone}</p>*/}
            </Panel>


            <Dialog className="user-info-dialog" header="Informations personnelles" position="center" draggable={false} visible={displayBasic} style={{ width: '40vw' }} onHide={() => onHide('displayBasic')}>
                <Divider/>
                <form onSubmit={handleSubmit}>
                    <div className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-col">
                            <label htmlFor="firstname1">Prénom</label>
                            <span className="p-input-icon-left">
                            <i className="pi pi-user" />
                            <InputText className={!firstnameValid ? "p-invalid block": ""} name="firstname" type="text" defaultValue={user.firstName} keyfilter="alpha" onChange={handleChange}/>
                        </span>
                            {!firstnameValid ? <small  id="username2-help" className="p-error block">Le prénom doit être renseigné.</small> : null}
                        </div>
                        <div className="p-field p-col">
                            <label htmlFor="lastname1">Nom de famille</label>
                            <span className="p-input-icon-left">
                            <i className="pi pi-user" />
                            <InputText  className={!lastnameValid ? "p-invalid block": ""} name="lastname" type="text" defaultValue={user.lastName} keyfilter="alpha"  onChange={handleChange}/>
                        </span>
                            {!lastnameValid ? <small  id="username2-help" className="p-error block">Le nom de famille doit être renseigné.</small> : null}
                        </div>

                        <div className="p-field p-col-12">
                            <div className="p-field ">
                                <label htmlFor="firstname1">Adresse email</label>
                                <span className="p-input-icon-left" style={{ marginBottom: '0.25rem' }}>
                                    <i className="pi pi-user" />
                                    <InputText className={!emailValid ? "p-invalid block": ""} name="email" type="text" defaultValue={user.email} keyfilter="email" onChange={handleChange}/>
                                </span>
                                {!emailValid ? <small  id="username2-help" className="p-error block">L'adresse email est invalide.</small> : null}
                            </div>
                        </div>
                    </div>
                    <div className="form-actions">
                        <Button type="submit" label="Sauvegarder" icon="pi pi-save" onClick={() => { onHide('displayBasic')}} disabled={!firstnameValid || !lastnameValid || !emailValid}/>
                    </div>
                </form>
            </Dialog>
        </Card>
    </div>
}

export default UserInfo
