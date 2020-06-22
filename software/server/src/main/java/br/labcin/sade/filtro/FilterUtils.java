package br.labcin.sade.filtro;

import javax.persistence.TypedQuery;

import org.springframework.data.domain.Pageable;

public final class FilterUtils {
	private FilterUtils() {}
	
	/**
	 * @author André Pacheco
	 * Esse método é simplesmente para evitar do filtro retornar todos os dados de uma vez só.
	 * Com essa configuração, só é retornado os elementos da página requisitada. Isso evita
	 * repostas lentas para o frontend
	 * @param query A query que vai vim do CriteriaBuilder
	 * @param pageable A página desejada
	 * @return O resultado da query com a pagina desejada
	 */
	public static <T> TypedQuery<T> configurePagination(TypedQuery<T> query, Pageable pageable) {
		if(pageable == null) {
			return query;
		}
		
		query.setFirstResult((pageable.getPageNumber())*pageable.getPageSize())
			.setMaxResults(pageable.getPageSize());
		
		return query;
	}
}
