package br.labcin.sade.seguranca;

import java.io.IOException;
import java.util.Arrays;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * @author André Pacheco
 * 
 * Essa classe configura o spring boot para realizar a autenticação de usuário do sistema
 * Caso o usuário exista, esteja apto e a senha esteja correta, a requisição para /login retorna
 * 200 com um JSON 'usuario-autenticado'. Caso contrário, retorna 401 e 'falha-autenticacao'.
 *
 */

@Configuration
@EnableWebSecurity
public class SegurancaWebConfig extends WebSecurityConfigurerAdapter{
	
	@Autowired
	private ServicoDetUsuario serDetUsu;
	
	// Define se é uma operação em producao ou desenvolvimento
	@Value("${tipo.operacao}")
	private String tipoOperacao;
			
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.cors();
		
		// Em dev eu quero expor as apis para o angular. Em prod elas devem ser bloqueadas
		if (this.tipoOperacao.equals("dev")) {
			http.authorizeRequests().antMatchers("/dashboard/**").authenticated();
		} else {
			http.authorizeRequests().antMatchers("/dashboard/**", "/api/**").authenticated();
		}
		
		http.authorizeRequests().anyRequest().permitAll()
		.and().csrf().disable();
		
		http.formLogin().loginPage("/login")
		.successHandler(successHandler()).failureHandler(failureHandler());

	}

	
	@Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("authorization", "content-type", "x-auth-token"));
        configuration.setExposedHeaders(Arrays.asList("x-auth-token"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
	
	// Retorna 200 e 'usuario-autenticado' sucesso para aqueles usuarios que conseguirem logar
	private AuthenticationSuccessHandler successHandler() {
		return new AuthenticationSuccessHandler() {
			@Override
			public void onAuthenticationSuccess(HttpServletRequest httpServletRequest,
					HttpServletResponse httpServletResponse, Authentication authentication)
					throws IOException, ServletException {
				httpServletResponse.getWriter().append("{\"estado\": \"usuario-autenticado\"}");
				httpServletResponse.setStatus(200);
			}
		};
	}

	// Retorna 401 e 'falha-autenticacao' usuario-logado para aqueles usuarios que conseguirem logar
	private AuthenticationFailureHandler failureHandler() {
		return new AuthenticationFailureHandler() {
			@Override
			public void onAuthenticationFailure(HttpServletRequest httpServletRequest,
					HttpServletResponse httpServletResponse, AuthenticationException e)
					throws IOException, ServletException {
				httpServletResponse.getWriter().append("{\"estado\": \"falha-autenticacao\"}");
				httpServletResponse.setStatus(200);
			}
		};
	}
	
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception{
		//auth.inMemoryAuthentication()
		//.withUser("Andre").password("123").roles("ADMIN");		
		auth.userDetailsService(serDetUsu).passwordEncoder(new BCryptPasswordEncoder());
	}


}
