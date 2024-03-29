import "./AdminOverview.css";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Panel } from "primereact/panel";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useForm, Controller } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { InputText } from "primereact/inputtext";
import { AdminService } from "../../AdminService";
import { useState, useEffect } from "react";
import { ProgressSpinner } from 'primereact/progressspinner';

function AdminOverview({ Refresh, dataPending, toast, admin }) {
    const { control, formState: { errors }, handleSubmit, reset } = useForm({});
    const [displayDialog, setDisplayDialog] = useState(false);
    const [mailExists, setMailExists] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [isPendingStats, setIsPendingStats] = useState(true);
    const [stats, setStats] = useState({
        nbDonations: 43795,
        nbDonors: 2736,
        nbAssociations: 35,
    })
    const adminService = new AdminService()
    const adminData = admin

    useEffect(() => {
        adminService.getAdminOverviewStats().then((response) => {
            if (response.statusCode !== 200 && toast.current !== null) {
                toast.current.show({ severity: 'error', summary: 'Erreur', detail: response.statusCode + " : " + response.message, life: 3000 });
            } else {
                setStats(response.data)
            }
            setIsPendingStats(false)
        });
    }, [toast]);

    // display the admin update info dialo
    const onClick = () => {
        setDisplayDialog(true)
    }

    // send the update admin info request 
    const save = (data) => {
        setIsPending(true)
        adminService.updateAdminInfo(adminData.id, data).then((response) => {
            if (response.statusCode !== 200 && toast.current !== null) {
                if (response.statusCode === 400) {
                    setMailExists(true)
                } else {
                    toast.current.show({ severity: 'error', summary: 'Erreur', detail: response.statusCode + " : " + response.message, life: 3000 });
                }
            } else {
                onHide()
                toast.current.show({ severity: 'success', summary: 'Confirmation', detail: 'Les modifications on bien étais pris en compte !', life: 3000 });
            }
            setIsPending(false)
        });
    }

    // reset every form and dialog
    const onHide = () => {
        reset()
        setMailExists(false)
        setDisplayDialog(false)
        Refresh()
    }

    // add the footer for the dialog
    function dialogFooter() {
        return (
            <div style={{ textAlign: 'center' }}>
                {isPending ?
                    <Button type="submit" disabled label="Sauvegarde..." icon="pi pi-save" />
                    :
                    <Button type="submit" label="Sauvegarder" icon="pi pi-save" />
                }
            </div>
        );
    }

    // add the footer for the card
    function cardFooter() {
        return (
            <div className="actions">
                <Button label="Modifier" icon="pi pi-pencil" iconPos="right" onClick={() => onClick()} />
            </div>
        );
    }

    // get the form error message 
    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    return <div className="admin-contents">
        <Card title="Informations générales" style={{ height: '100%' }}>
            <Toast ref={toast} />
            <Divider />
            <Panel header="Informations personnelles">
                {dataPending ? <div className="p-d-flex p-jc-evenly"><ProgressSpinner /></div> :
                    <div >
                        <p className='info'><span>Prénom : </span>{adminData.firstName}</p>
                        <Divider />

                        <p className='info'><span>Nom de famille : </span>{adminData.lastName}</p>
                        <Divider />

                        <p className='info'><span>Email : </span>{adminData.email}</p>
                    </div>
                }
            </Panel>
            {cardFooter()}
            <br />
            <Panel header="Statistiques générales">
                <div className="p-d-flex p-jc-evenly">
                    {isPendingStats ? <ProgressSpinner /> :
                        <div className="p-mr-4">
                            <Card className="stats-overview-nb" title="Totale de dons">
                                <p>{stats.nbDonations}€</p>
                            </Card>
                        </div>
                    }
                    {isPendingStats ? <ProgressSpinner /> :
                        <div className="p-mr-4">
                            <Card className="stats-overview-nb" title="Nombre d'associations">
                                <p>{stats.nbAssociations}</p>

                            </Card>
                        </div>
                    }
                    {isPendingStats ? <ProgressSpinner /> :
                        <div className="p-mr-4">
                            <Card className="stats-overview-nb" title="Nombre de donateurs">
                                <p>{stats.nbDonors}</p>

                            </Card>
                        </div>
                    }
                </div>
            </Panel>
            <Dialog header="Informations personnelles" position="center" draggable={false} visible={displayDialog} style={{ width: '30vw' }} onHide={() => onHide()}>
                <Divider />
                <form onSubmit={handleSubmit(save)} className="p-fluid">
                    <div className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-col-12">
                            <label htmlFor="firstname">Prénom</label>
                            <span className="p-input-icon-left">
                                <i className="pi pi-user" />
                                <Controller name="firstName" control={control} render={({ field, fieldState }) => (
                                    <InputText id={field.name} placeholder={adminData.firstName} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                            </span>
                        </div>
                        <div className="p-field p-col-12">
                            <label htmlFor="lastname">Nom de famille</label>
                            <span className="p-input-icon-left">
                                <i className="pi pi-user" />
                                <Controller name="lastName" control={control} render={({ field, fieldState }) => (
                                    <InputText id={field.name} placeholder={adminData.lastName} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                            </span>
                        </div>
                        <div className="p-field p-col-12">
                            <label htmlFor="firstname">Adresse email</label>
                            <span className="p-input-icon-left">
                                <i className="pi pi-user" />
                                <Controller name="email" control={control}
                                    rules={{ pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Adresse email invalide. Ex: example@email.com' } }}
                                    render={({ field, fieldState }) => (
                                        <InputText onInput={() => setMailExists(false)} placeholder={adminData.email} id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                    )} />
                            </span>
                            {getFormErrorMessage('email')}
                        </div>
                    </div>
                    <br />
                    {dialogFooter()}
                    <br />
                    {mailExists && <small className="p-error">l'adresse email renseignée est déjà utilisé</small>}
                </form>
            </Dialog>
        </Card>
    </div>
}


export default AdminOverview
