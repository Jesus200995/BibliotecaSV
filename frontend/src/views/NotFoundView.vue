<template>
  <div class="not-found-view">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-6 text-center">
          <div class="error-container">
            <div class="error-code">404</div>
            <div class="error-message">
              <h2 class="mb-3">Página no encontrada</h2>
              <p class="text-muted mb-4">
                Lo sentimos, la página que buscas no existe o ha sido movida.
              </p>
            </div>
            <div class="error-actions">
              <router-link :to="{ name: 'Dashboard' }" class="btn btn-primary me-3">
                <i class="fas fa-home me-2"></i>
                Ir al Inicio
              </router-link>
              <router-link :to="{ name: 'Archivos' }" class="btn btn-outline-primary">
                <i class="fas fa-folder-open me-2"></i>
                Ver Catálogo
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFoundView'
}
</script>

<style scoped>
.not-found-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
}

.error-container {
  padding: 3rem 2rem;
}

.error-code {
  font-size: 8rem;
  font-weight: bold;
  color: #007bff;
  line-height: 1;
  margin-bottom: 1rem;
}

.error-message h2 {
  color: #343a40;
  font-weight: 600;
}

.error-actions {
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .error-code {
    font-size: 5rem;
  }

  .error-actions .btn {
    display: block;
    width: 100%;
    margin-bottom: 1rem;
  }
}
</style>
