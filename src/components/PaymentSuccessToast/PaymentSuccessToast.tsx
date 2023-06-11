import React from 'react';
import PropTypes from 'prop-types';
import styles from './PaymentSuccessToast.module.css';
import { Toast, ToastContainer } from 'react-bootstrap';

const PaymentSuccessToast = () => (
  <div className={styles.PaymentSuccessToast}>
    <ToastContainer className="position-static">
      <Toast>
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
          <strong className="me-auto">Pagamento realizado com sucesso.</strong>
          <small className="text-muted">TIME</small>
        </Toast.Header>
        <Toast.Body>Você será redirecionado em breve</Toast.Body>
      </Toast>
    </ToastContainer>
  </div>
);

PaymentSuccessToast.propTypes = {};

PaymentSuccessToast.defaultProps = {};

export default PaymentSuccessToast;